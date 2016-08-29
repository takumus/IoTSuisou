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
	sendAll:(data) => {
		sendAll(data);
	}
}

const connect = (socket) => {
	const reply = (data) => send(data, socket);
	eventEmitter.emit("connect", reply);
	socket.on("message", (data) => {
		try{
			eventEmitter.emit("data", JSON.parse(data), reply);
		}catch(error){}
	});
	socket.on("close", () => {
		eventEmitter.emit("close");
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
		if(socket)socket.send(dataStr);
	});
}
const send = (data, socket) => {
	const dataStr = JSON.stringify(data);
	socket.send(dataStr);
}