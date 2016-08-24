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
	console.log("[from arduino]:")
	console.log(data);
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
	console.log("[from server]:")
	console.log(data);
});
server.on("close", (data) => {
	console.log("サーバーとの接続は切れた");
});

//---------------------------------//
//標準入力受付。
//---------------------------------//
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	chunk.trim().split("\n").forEach((line) => {
		const cmd = line.split(" ");
		const task = cmd.shift();
		const args = cmd.join(" ");
		beginTasks[task](args);
	});
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