"use strict"
const events = require("events");
const eventEmitter = new events.EventEmitter();
const SerialPort = require("serialport");
let serialPort;

module.exports = {
	//オープン
	open:(port)=>{
		serialPort = new SerialPort(port, {
			baudrate: 9600,
			parser: SerialPort.parsers.readline("\n")
		});
		init();
	},
	//イベント
	on:(event, listener) => {
		eventEmitter.on(event, listener);
	},
	//送信
	send:(data) => {
		serialPort.write(data);
	},

	//タスク
	task:{
		//水位計測
		measure:() => {
			serialPort.write("m");
		}
	}
}

const init = () => {
	serialPort.on("open", () => eventEmitter.emit("open"));
	serialPort.on("data", (data) => {
		try{
			const obj = JSON.parse(data);
			eventEmitter.emit("data", obj);
			return;
		}catch(error){
		}
	});
	serialPort.on("error", (error) => eventEmitter.emit("error"));
	serialPort.on("close", () => eventEmitter.emit("close"));
}