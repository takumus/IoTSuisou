"use strict"
const ws = require("websocket.io");
const events = require("events");
const eventEmitter = new events.EventEmitter();
let server;
const clients = {};
let clientId = 0;
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
	},
	send:(data, receiverId) => {
		//既に接続解除してたかも
		if(clients[receiverId]) {
			clients[receiverId].send(data);
		}
	},
	clients:clients
}

const connect = (socket) => {
	const client = {
		id:clientId,
		send:(data) => send(data, socket),
		closed:false
	}
	//クライアントへ追加
	clients[client.id] = client;
	clientId ++;
	eventEmitter.emit("connect", client);
	socket.on("message", (data) => {
		try{
			eventEmitter.emit("data", JSON.parse(data), client);
		}catch(error){}
	});
	socket.on("close", () => {
		eventEmitter.emit("close");
		client.closed = true;
		delete clients[client.id];
	});
	socket.on("disconnect", () => {
	});
	socket.on("error", (error) => {
		eventEmitter.emit("error");
	});
}

const sendAll = (data) => {
	Object.keys(clients).forEach((key)=>{
		clients[key].send(data);
	})
}
const send = (data, socket) => {
	const dataStr = JSON.stringify(data);
	socket.send(dataStr);
}