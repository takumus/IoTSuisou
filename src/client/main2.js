//------------------------------------------------//
//ソケット君
//------------------------------------------------//
var socket = (function(){
	var socket;
	var exports = {
		//接続を開く
		open:function(host){
			if(socket){
				socket.close();
				socket = null;
			}
			socket = new WebSocket(host);
			socket.addEventListener("open", exports.onOpen);
			socket.addEventListener("message", onMessage);
			socket.addEventListener("close", exports.onClose);
		},
		//送る
		send:function(data){
			socket.send(JSON.stringify(data));
		},
		//開いたとき
		onOpen:function(){},
		//閉じたとき
		onClose:function(){},
		//データ来たとき
		onData:function(){}
	}
	var onMessage = function(event){
		var data = JSON.parse(event.data);
		exports.onData(data);
	}
	return exports;
})();

//------------------------------------------------//
//ライト君
//------------------------------------------------//
var light = (function(send){
	var exports = {
		power:function(power){
		},
		setStatus:function(power){
			send({
				method:"task",
				task:{
					task:"light",
					power:power
				}
			});
		}
	};
})(socket.send);


socket.onOpen = function(){
	console.log("connected");
}
socket.onClose = function(){
	console.log("closed");
}
socket.onData = function(data){
	if(data.method == "status"){

	}
}

window.addEventListener("load", function(){
	socket.open(CONFIG.host);
});
/*
window.addEventListener("click", function(){
	socket.open(CONFIG.host);
});
*/