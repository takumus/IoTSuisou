var load = function(){
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
		var statusElem = document.getElementById("light_status");
		var onElm = document.getElementById("light_on_btn");
		var offElm = document.getElementById("light_off_btn");
		onElm.onclick = function(){
			exports.power(true);
		}
		offElm.onclick = function(){
			exports.power(false);
		}
		var exports = {
			power:function(power){
				send({
					method:"task",
					task:{
						task:"light",
						power:power
					}
				});
			},
			setStatus:function(power){
				onElm.disabled = power;
				offElm.disabled = !power;
				if(power){
					statusElem.innerText = "点灯中";
				}else{
					statusElem.innerText = "消灯中";
				}
			}
		};
		return exports;
	})(socket.send);

	//------------------------------------------------//
	//メイン
	//------------------------------------------------//
	socket.onOpen = function(){
		console.log("connected");
		socket.send({method:"status"});
	}
	socket.onClose = function(){
		console.log("closed");
	}
	socket.onData = function(data){
		if(data.method == "status"){
			light.setStatus(data.status.light);
		}
		console.log(data);
	}
	socket.open(CONFIG.host);
}

window.addEventListener("load", load);
/*
window.addEventListener("click", function(){
	socket.open(CONFIG.host);
});
*/