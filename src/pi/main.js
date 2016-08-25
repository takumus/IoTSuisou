"use strict"
const CONFIG = require("./config");
const arduino = require("./libs/arduino");
const server = require("./libs/server");

let connected = false;

//---------------------------------//
//Arduinoとシリアル通信
//---------------------------------//

arduino.open(CONFIG.arduinoPort);
arduino.on("error",() => {
	console.log("Arduinoが見つからない:(");
});
arduino.on("open", () => {
	console.log("Arduinoに接続した:)");
});
arduino.on("data", (data) => {
	console.log("[Arduinoから]:");
	console.log(data);
	server.send(data);
});
arduino.on("close", () => {
	console.log("Arduinoとの接続は切れた");
});
//---------------------------------//
//サーバーとソケット通信
//---------------------------------//

server.open(CONFIG.port, CONFIG.host);
server.on("error", () => {
	console.log("サーバーが見つからない:(");
});
server.on("open", () => {
	console.log("サーバーに接続した:)");
	connected = true;
});
server.on("data", (data) => {
	console.log("[サーバーから]:");
	console.log(data);
	//arduinoへ送信
	if(data.task == "measure"){
		arduino.task.measure();
	}
});
server.on("close", (data) => {
	console.log("サーバーとの接続は切れた");
	connected = false;
});


//再接続
setInterval(() => {
	if(!connected) server.open(CONFIG.port, CONFIG.host);
}, 1000 * 5)