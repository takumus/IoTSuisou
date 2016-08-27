"use strict"
const CONFIG = require("./config");

const pi = require("./libs/pi");
const DB = require("./libs/db");
const db = DB.open(CONFIG.dbfile);
const db_waterlevel = require("./libs/db_waterlevel");

//水位のデータベース
db_waterlevel.open(db, "waterlevel");
db_waterlevel.getData(new Date().getTime(), 100, (error, data)=>{
	console.log(data);
})
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

pi.open(CONFIG.socketPort);
pi.on("error", () => {
	console.log("piとの間に何らかのエラー:(");
});
pi.on("open", () => {
	console.log("pi用サーバー立った");
});
pi.on("connect", () => {
	console.log("piが接続してきた:)");
	pi.send({
		comment:"hello pi"
	});
});
pi.on("data", (data) => {
	//console.log("[piから]:");
	//console.log(data);
	try{
		const level = Math.sin(data.value / 180 * Math.PI)*8;
		db_waterlevel.addData(level);
		console.log(level);
	}catch(error){
	}
});
pi.on("close", (data) => {
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
		};
		pi.send(data);
	});
});

setInterval(()=>{
	const data = {
		task:"feed",
		loop:2
	};
	console.log(data);
	pi.send(data);
}, 1000 * 30);