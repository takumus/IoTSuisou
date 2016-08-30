"use strict"
const CONFIG = require("./config");
const arduino = require("./libs/arduino");
const server = require("./libs/server");
let tasks = [];
let working = false;
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
	tasks.length = 0;
});
arduino.on("data", (result) => {
	console.log("[Arduinoから]:");
	console.log(result);
	server.send({
		method:"complete",
		result:result
	});
	if(tasks.length > 0){
		sendTask(tasks.shift());
	}else{
		working = false;
		status.set("workingTask", null).send();
	}
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
server.on("data", (data, receiverId) => {
	console.log("[サーバーから]:");
	console.log(data);

	//タスクであれば
	if(data.method == "task"){
		const task = data.task;
		//存在しないタスクは削除
		if(!arduino.task[task.task]) return;
		//タスク実行or登録
		if(working){
			tasks.push(task);
			return;
		}
		working = true;
		sendTask(task);
		return;
	}
	//ステータス入手であれば
	if(data.method == "status"){
		//receiverだけがstatus入手なのでidつける
		status.send(receiverId);
	}
});
server.on("close", (data) => {
	console.log("サーバーとの接続は切れた");
	connected = false;
});

//---------------------------------//
//Arduinoへタスク送信
//---------------------------------//
const sendTask = (task) => {
	status.set("workingTask", task);

	if(task.task == "measure"){
		arduino.task.measure();
	}else if(task.task == "feed"){
		arduino.task.feed(task.loop);
	}else if(task.task == "light"){
		arduino.task.light(task.power);
		status.set("light", task.power);
	}
	status.send();
}

//---------------------------------//
//ステータス管理
//---------------------------------//
const status = {
	status:{
		light:false,
		workingTask:null
	},
	set:function(key, val){
		this.status[key] = val;
		return this;
	},
	get:function(key){
		return this.status[key];
	},
	send:function(receiverId){
		server.send({
			method:"status",
			status:this.status
		}, receiverId?receiverId:-1);
	}
}

//再接続
setInterval(() => {
	if(!connected) server.open(CONFIG.port, CONFIG.host);
}, 1000 * 5)