const net = require('net');

const WEBSOCKET_PORT = 25595;
const SOCKET_PORT = 25596;

//ウェブソケット
const ws = require('websocket.io');
const webSockets = {};
const webSocketServer = ws.listen(WEBSOCKET_PORT, () => {
	console.log('bind websocket.io ' + WEBSOCKET_PORT);
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
		console.log(error.stack);
	});
});
//普通のソケット
const sockets = {};
const socketServer = net.createServer((socket) => {
	console.log('s:connected');
	socket.on('data', (data) => {
		console.log(data);
		//app.stdin.write(new Buffer(data));
	});
	socket.on('close', () => {
		console.log('s:disconnected');
	});
	socket.on('error', (error) => {
		console.log("s:error");
		console.log(error.stack);
	});
}).listen(SOCKET_PORT, () => {
	console.log("bind socket " + SOCKET_PORT);
});