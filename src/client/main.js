var send
window.addEventListener("load",function() {

	var socket = new WebSocket(CONFIG.host);
	socket.addEventListener("open", function() {
	});
	socket.addEventListener("message", function(event) {
		console.log(JSON.parse(event.data));
	});
	send = function(data) {
		socket.send(JSON.stringify(data));
	}

	//いろいろ
	document.getElementById("light").addEventListener("change", function(e){
		send({
			method:"task",
			task:{
				task:"light",
				power:e.target.checked.toString()
			}
		});
	});
});