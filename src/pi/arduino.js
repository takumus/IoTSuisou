//---------------------------------//
//Arduinoとシリアル通信
//---------------------------------//
"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const SerialPort = require("serialport");
let serialPort;

module.exports = {
	open:(port)=>{
		serialPort = new SerialPort(port, {
			baudrate: 9600,
			parser: SerialPort.parsers.readline("\n"),
			autoOpen: false
		});
		init();
	},
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	send:(data) => {
		serialPort.write(data);
	}
}
const init = () => {
	serialPort.on("open", () => {
		eventEmitter.emit("open");
	});
	serialPort.on("data", (data) => {
		try{
			const obj = JSON.parse(data);
			eventEmitter.emit("data", obj);
			return;
		}catch(error){
		}
	});
	serialPort.on("error", (error) => {
		eventEmitter.emit("error");
		console.log("arduinoに接続できません");
	});
	serialPort.on("close", () => {
		eventEmitter.emit("close");
		console.log("arduinoとの接続解除");
	});
}