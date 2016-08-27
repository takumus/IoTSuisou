"use strict"
const ws = require("websocket.io");
const events = require("events");
const eventEmitter = new events.EventEmitter();
let server;
let connectedSocket;
const sockets = {};
module.exports = {
	open:(port) => {
		server = ws.listen(port, () => {
			eventEmitter.emit("open");
		}).on("connection", connect);
	},
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	send:(data) => {
		try{
			
		}catch(error){}
	}
}

const connect = (socket) => {
	eventEmitter.emit("connect");
	const reply = (data) => send(data, socket);
	sendAll({
		message:"hello"
	});
	socket.on("message", (data) => {
		try{
			eventEmitter.emit("data", JSON.parse(data), reply);
		}catch(error){}
	});
	socket.on("close", () => {
		eventEmitter.emit("close");
		socket.destroy();
	});
	socket.on("disconnect", () => {
	});
	socket.on("error", (error) => {
		eventEmitter.emit("error");
	});
}

const sendAll = (data) => {
	const dataStr = JSON.stringify(data);
	server.clients.forEach((socket) => {
		socket.send(dataStr);
	});
}
const send = (data, socket) => {
	const dataStr = JSON.stringify(data);
	socket.send(dataStr);
}