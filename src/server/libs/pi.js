"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const net = require("net");
let server;
let connectedSocket;

module.exports = {
	open:(port) => {
		server = net.createServer(connect).listen(port, () => {
			eventEmitter.emit("open");
		});
		server.maxConnections = 1;
	},
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	send:(data) => {
		try{
			connectedSocket.write(JSON.stringify(data));
		}catch(error){}
	}
}

const connect = (socket) => {
	socket.on("data", (data) => {
		try{
			eventEmitter.emit("data", JSON.parse(data.toString()));
		}catch(error){}
	});
	socket.on("close", () => {
		eventEmitter.emit("close")
		socket.destroy();
		connectedSocket = null;
	});
	socket.on("error", (error) => {
		eventEmitter.emit("error");
	});
	connectedSocket = socket;
	eventEmitter.emit("connect");
}