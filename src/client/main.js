var send;
window.addEventListener("load",function() {
	var statusElem = document.getElementById("status");
	var lightElem = document.getElementById("light");
	var feedElem = document.getElementById("feed");
	var wlElem = document.getElementById("waterlevel");

	var socket = new WebSocket(CONFIG.host);

	var getWaterLevel = function(){
		send({method:"waterlevel", time:new Date().getTime(), length:100});
	}
	socket.addEventListener("open", function() {
		console.log("connected");
		send({method:"status"});
		getWaterLevel();
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
		if(data.method == "waterlevel"){
			waterlevel(data.datas);
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
		console.log(status);
		var str = "<b>照明</b>:" + (status.light?"点灯":"消灯") + "<br>";
		lightElem.checked = status.light;
		str += "<b>実行中タスク</b>:" + (status.workingTask?status.workingTask.task:"なし") + "<br>";
		statusElem.innerHTML = str;
	}
	var completeTask = function(result){
		console.log("タスク完了");
		console.log(result);
	}

	var waterlevel = function(datas){
		wlElem.innerHTML = "";
		datas.forEach(function(data){
			var e = document.createElement("li");
			var d = new Date(data.date);
			var v = Math.floor(data.value * 1000)/1000;
			var dstr = (d.getMonth()+1)+" / "+d.getDate()+" "+d.getHours()+":"+d.getMinutes();
			e.innerText = dstr + " : " + v + " cm";
			wlElem.appendChild(e);
		});
	}

	//いろいろ
	lightElem.addEventListener("change", function(e){
		send({
			method:"task",
			task:{
				task:"light",
				power:e.target.checked
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