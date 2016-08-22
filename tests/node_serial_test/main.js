var SerialPort = require("serialport")
var sp = new SerialPort("COM7", {
	baudrate: 9600,
	parser:SerialPort.parsers.readline("\n")
});
sp.on('data', (data) => {
	console.log("[from arduino]:"+data);
});
setInterval(()=>{
	sp.write("m");
}, 1000 * 60 * 60);

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
    chunk.trim().split('\n').forEach((line) => {
		sp.write(line);
    });
});