"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const net = require("net");
const socket = new net.Socket();

module.exports = {
	open:(port, host) => {
		socket.connect(port, host, ()=>{
		});
	},
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	send:(data) => {
		socket.write(JSON.stringify(data));
	}
}

socket.on("data", (data) => {
	try{
		eventEmitter.emit("data", JSON.parse(data.toString()));
	}catch(error){}
});
socket.on("connect", () => {
	eventEmitter.emit("open");
});
socket.on("error", (error) => {
	eventEmitter.emit("error");
});
socket.on("close", () => {
	eventEmitter.emit("close");
})