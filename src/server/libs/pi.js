"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const net = require("net");
let server;
let connectedSocket;
const replies = {};
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
	send:(data, receiver) => {
		try{
			const sendData = {
				data:data
			}
			if(receiver){
				//replies[receiver.id] = receiver;
				sendData.receiverId = receiver.id;
			}else{
				sendData.receiverId = -1;
			}
			connectedSocket.write(JSON.stringify(sendData) + "\n");
		}catch(error){}
	}
}

const connect = (socket) => {
	socket.on("data", (data) => {
		try{
			const _data = JSON.parse(data.toString());
			eventEmitter.emit("data", _data.data, _data.receiverId);
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
setInterval(() => {
	try{
		connectedSocket.write("\n");
	}catch(error){}
}, 30 * 1000);