window.addEventListener('load',function() {
	document.body.innerText = "connecting";

	var socket = new WebSocket(CONFIG.host);
	socket.addEventListener('open', function() {
		document.body.innerText = "connected";
		
		window.onclick = function(){
			send({
				message:"from pi"
			})
		}
	});
	socket.addEventListener('message', function(event) {
		console.log(JSON.parse(event.data));
	});

	var send = function(data) {
		socket.send(JSON.stringify(data));
	}
});