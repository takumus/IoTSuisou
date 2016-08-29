"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const net = require("net");
const socket = new net.Socket();
let connected = false;
module.exports = {
	open:(port, host) => {
		socket.connect(port, host);
	},
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	send:(data) => {
		socket.write(JSON.stringify(data));
	}
}

socket.on("data", (datas) => {
	try{
		datas.toString().split("\n").forEach((data) => {
			eventEmitter.emit("data", JSON.parse(data));
		});
	}catch(error){}
});
socket.on("connect", () => {
	connected = true;
	eventEmitter.emit("open");
});
socket.on("error", (error) => {
	eventEmitter.emit("error");
});
socket.on("close", () => {
	if(connected) eventEmitter.emit("close");
})