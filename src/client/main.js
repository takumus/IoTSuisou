var Utils = (function(){
	var exports = {
		toHHMM:function(h, m){
			h = ("0"+h).slice(-2);
			m = ("0"+m).slice(-2);
			return h + ":" + m;
		}
	}
	return exports;
}());
var load = function(){
	//------------------------------------------------//
	//ソケット君
	//------------------------------------------------//
	var Socket = (function(){
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
	var Light = (function(){
		var statusElm = document.getElementById("light_status");
		var onBtnElm = document.getElementById("light_on_btn");
		var offBtnElm = document.getElementById("light_off_btn");
		var beginInputElm = document.getElementById("light_begin_input");
		var endInputElm = document.getElementById("light_end_input");
		var settingBtnElm = document.getElementById("light_setting_btn");
		//ライトオンオフ
		onBtnElm.onclick = function(){
			exports.power(true);
		}
		offBtnElm.onclick = function(){
			exports.power(false);
		}
		//設定保存
		settingBtnElm.onclick = function(){
			var light = Setting.get().light;
			var beginTimeValue = beginInputElm.value.split(":");
			var endTimeValue = endInputElm.value.split(":");
			light.begin_time = {
				h:Number(beginTimeValue[0]),
				m:Number(beginTimeValue[1])
			}
			light.end_time = {
				h:Number(endTimeValue[0]),
				m:Number(endTimeValue[1])
			}
			Setting.update();
		}
		var exports = {
			power:function(power){
				if(!confirm("ライトを"+(power?"点灯":"消灯")+"しますか？")) return;
				Socket.send({
					method:"task",
					task:{
						task:"light",
						power:power
					}
				});
			},
			updateCurrentPower:function(power){
				onBtnElm.disabled = power;
				offBtnElm.disabled = !power;
				onBtnElm.innerHTML = power?"<s>点灯</s>":"点灯";
				offBtnElm.innerHTML = !power?"<s>消灯</s>":"消灯";
				statusElm.innerText = power?"[点灯中]":"[消灯中]";
				statusElm.className = power?"light_status_on":"light_status_off";
			},
			updateCurrentSetting:function(){
				var light = Setting.get().light;
				beginInputElm.value = Utils.toHHMM(light.begin_time.h, light.begin_time.m);
				endInputElm.value = Utils.toHHMM(light.end_time.h, light.end_time.m);
			}
		};
		return exports;
	})();
	//------------------------------------------------//
	//ライト君
	//------------------------------------------------//
	var Feed = (function(){
		var feedBtnElm = document.getElementById("feed_btn");
		var feedLoopInputElm = document.getElementById("feed_loop_input");
		//ライトオンオフ
		feedBtnElm.onclick = function(){
			Socket.send({
				method:"task",
				task:{
					task:"feed",
					loop:Math.floor(Number(feedLoopInputElm.value))
				}
			})
		}
		var exports = {
			updateCurrentSetting:function(){}
		};
		return exports;
	})();
	//------------------------------------------------//
	//アラート君
	//------------------------------------------------//
	var Alert = (function(){
		var bodyElm = document.getElementById("alert_body");
		var labelElm = document.getElementById("alert_label");
		var textElm = document.getElementById("alert_text");
		var exports = {
			show:function(label, text){
				bodyElm.style.visibility = "visible";
				labelElm.innerText = label;
				textElm.innerText = text;
			},
			hide:function(){
				setTimeout(function() {
					bodyElm.style.visibility = "hidden";
				}, 1000);
			}
		};
		return exports;
	})();
	//------------------------------------------------//
	//設定君
	//------------------------------------------------//
	var Setting = (function(){
		var current;
		var exports = {
			_set:function(setting){
				if(current){
					Alert.show("水槽サーバー", "設定が更新されました。");
					Alert.hide();
				}
				current = setting;
			},
			get:function(){
				return current;
			},
			update:function(){
				Socket.send({
					method:"set_setting",
					setting:current
				});
			}
		}
		return exports;
	}());
	//------------------------------------------------//
	//メイン
	//------------------------------------------------//
	Socket.onOpen = function(){
		console.log("connected");
		Alert.show("水槽サーバー","接続完了した。");
		Alert.hide();
		Socket.send({method:"status"});
		Socket.send({method:"get_setting"});
	}
	Socket.onClose = function(){
		console.log("closed");
		Alert.show("水槽サーバー", "切断されました。");
	}
	Socket.onData = function(data){
		var dataType = data.type;
		if(dataType == "status"){
			Light.updateCurrentPower(data.status.light);
			var working = data.status.workingTask;
			if(working){
				Alert.show("タスク実行中", working.task)
			}else{
				Alert.hide();
			}
		}
		if(dataType == "setting"){
			Setting._set(data.setting);
			Light.updateCurrentSetting();
		}
		console.log(data);
	}
	Socket.open(CONFIG.host);
	Alert.show("水槽サーバー", "いま接続中です。");
}

window.addEventListener("load", load);
/*
window.addEventListener("click", function(){
	socket.open(CONFIG.host);
});
*/