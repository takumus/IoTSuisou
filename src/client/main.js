var send;
window.addEventListener("load",function() {
	var statusElem = document.getElementById("status");
	var lightElem = document.getElementById("light");
	var feedElem = document.getElementById("feed");

	var socket = new WebSocket(CONFIG.host);
	socket.addEventListener("open", function() {
		console.log("connected");
		send({method:"status"});
	});
	socket.addEventListener("message", function(event) {
		var data = JSON.parse(event.data);
		if(data.method == "status"){
			receiveStatus(data.status);
			return;
		}
		if(data.method == "complete"){
			completeTask(data.result);
			return;
		}
		console.log("その他データ受信");
		console.log(data);
	});
	send = function(data) {
		socket.send(JSON.stringify(data));
	}

	var receiveStatus = function(status){
		console.log("ステータス更新");
		//console.log(status);
		var str = "<b>照明</b>:" + (status.light=="true"?"点灯":"消灯") + "<br>";
		str += "<b>実行中タスク</b>:" + (status.workingTask?status.workingTask.task:"なし") + "<br>";
		statusElem.innerHTML = str;
	}
	var completeTask = function(result){
		console.log("タスク完了");
		console.log(result);
	}

	//いろいろ
	lightElem.addEventListener("change", function(e){
		send({
			method:"task",
			task:{
				task:"light",
				power:e.target.checked.toString()
			}
		});
	});

	feedElem.addEventListener("click", function(e){
		send({
			method:"task",
			task:{
				task:"feed",
				loop:1
			}
		});
	});
});