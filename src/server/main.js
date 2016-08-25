"use strict"
const CONFIG = require("./config");

const server = require('./libs/server');

//ウェブソケット
/*
const ws = require('websocket.io');
const webSockets = {};
const webSocketServer = ws.listen(CONFIG.wsPort, () => {
	console.log('bind websocket.io ' + CONFIG.wsPort);
}).on('connection', (socket) => {
	const key = socket.req.headers['sec-websocket-key'];
	webSockets[key] = socket;
	console.log('ws:connected ' + key);
	socket.on('message', (data) => {
		console.log(data);
	});
	socket.on('close', () => {
		console.log('ws:closed');
		delete webSockets[key];
	});
	socket.on('disconnect', () => {
		console.log('ws:disconnected');
		delete webSockets[key];
	});
	socket.on('error', (error) => {
		console.log("ws:error");
		//console.log(error.stack);
	});
});*/

server.open(CONFIG.socketPort);
server.on("error", () => {
	console.log("piとの間に何らかのエラー:(");
});
server.on("open", () => {
	console.log("pi用サーバー立った");
});
server.on("connect", () => {
	console.log("piが接続してきた:)");
	server.send({
		comment:"hello pi"
	});
});
server.on("data", (data) => {
	console.log("[piから]:")
	console.log(data);
});
server.on("close", (data) => {
	console.log("piとの接続は切れた:(");
});

//---------------------------------//
//標準入力受付。
//---------------------------------//
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	chunk.trim().split("\n").forEach((line) => {
		const data = {
			task:line
		}
		//socket.write(JSON.stringify(data));
	});
});