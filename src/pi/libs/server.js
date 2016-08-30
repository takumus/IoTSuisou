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
	send:(data, receiverId) => {
		const sendData = {
			receiverId:receiverId?receiverId:-1,
			data:data
		}
		socket.write(JSON.stringify(sendData));
	}
}

socket.on("data", (datas) => {
	if(datas.toString() == "\n") {
		//console.log("接続維持");
		//接続維持用のやつ
		return;
	}
	try{
		datas.toString().split("\n").forEach((_data) => {
			_data = JSON.parse(_data);
			const data = _data.data;
			const receiverId = _data.receiverId;
			eventEmitter.emit("data", data, receiverId);
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