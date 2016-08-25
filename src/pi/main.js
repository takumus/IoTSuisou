"use strict"
const CONFIG = require("./config");
const arduino = require("./libs/arduino");
const server = require("./libs/server");

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
	server.send({
		comment:"hello"
	});
});
server.on("data", (data) => {
	console.log("[サーバーから]:")
	console.log(data);
	//arduinoへ送信
	arduino.send(data);
});
server.on("close", (data) => {
	console.log("サーバーとの接続は切れた");
});

//---------------------------------//
//タスク一覧
//---------------------------------//
const beginTasks = {
	//計測開始タスク
	measure:() => {
		port.write("m");
	},
	//ただのSerial送信タスク
	serial:(args)=>{
		port.write(args);
	}
}
const endTasks = {
	//計測終了タスク
	measure:(data) => {
		//complete
	}
}