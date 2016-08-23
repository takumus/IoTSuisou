const SerialPort = require("serialport");
const port = new SerialPort("/dev/ttyACM0", {
	baudrate: 9600,
	parser:SerialPort.parsers.readline("\n")
});

//タスク一覧
const beginTasks = {
	//計測開始タスク
	measure:() => {
		console.log(now());
		console.log("水面計測開始");
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
		console.log(now());
		console.log("水面計測完了");
		console.log("*結果　　 : " + data.result);
		console.log("*角度　　 : " + data.value);
		console.log("*角度誤差 : " + data.diff);
		console.log("*水面距離 : " + (Math.sin((data.value) / 180 * Math.PI))*15.8);
	}
}

port.on("data", (data) => {
	try{
		const obj = JSON.parse(data);
		endTasks[obj.type](obj);
		return;
	}catch(error){
	}
	console.log(data);
});
let prevHours = -1;
setInterval(() => {
	const h = now().getHours();
	if(h != prevHours){
		prevHours = h;
		beginTasks.measure();
	}
}, 10000);

const now = () => {
	const date = new Date();
	date.setHours(date.getHours()+9);
	return date;
}

//標準入力からシリアルへ。
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