"use strict"
const CONFIG = require("./config");

const pi = require("./libs/pi");
const setting = require("./libs/setting");
const clients = require("./libs/client");
const DB = require("./libs/db");
const db = DB.open(CONFIG.dbfile);
const db_waterlevel = require("./libs/db_waterlevel");

//設定ファイル系
setting.open(CONFIG.settingFile, {
	light:{
		begin_time:{h:10, m:0},
		end_time:{h:22, m:0}
	},
	measure:{
		interval_minutes:120,
		arm_length:6.9
	},
});
setting.save();

//水位のデータベース
db_waterlevel.open(db, "waterlevel");
db_waterlevel.getData(new Date().getTime(), 100, (error, data)=>{
	console.log(data);
})

//---------------------------------//
//クライアント
//---------------------------------//
clients.open(CONFIG.wsPort);
clients.on("error", () => {
	//console.log("clientとの間に何らかのエラー:(");
});
clients.on("open", () => {
	console.log("client用サーバー立った");
});
clients.on("connect", (client) => {
	console.log("clientが接続してきた:)");
	client.send({
		message:"hello client[" + client.id + "]"
	})
});
clients.on("data", (data, client) => {
	console.log("[clientから]");
	console.log(data);
	if(data.method == "setting"){
		clients.send
		return;
	}
	pi.send(data, client);	
});
clients.on("close", (data) => {
	console.log("clientとの接続は切れた:(");
});

//---------------------------------//
//パイ
//---------------------------------//
pi.open(CONFIG.socketPort);
pi.on("error", () => {
	//console.log("piとの間に何らかのエラー:(");
});
pi.on("open", () => {
	console.log("pi用サーバー立った");
});
pi.on("connect", () => {
	console.log("piが接続してきた:)");
});
pi.on("data", (data, receiverId) => {
	console.log("[piから"+(receiverId<0?"全員":receiverId)+"へ]:");
	console.log(data);

	if(data.method == "complete" && data.result.type == "measure"){
		//もし水位測定の結果だったら
		//データベースに水位を追加
		const result = data.result;
		const value = Math.sin(result.value/180*Math.PI)*setting.data.measure.arm_length;
		//db_waterlevel.addData()
	}
	if(receiverId < 0){
		clients.sendAll(data);
	}else{
		clients.send(data, receiverId);
	}
});
pi.on("close", (data) => {
	console.log("piとの接続は切れた:(");
});

//---------------------------------//
//スケジューリング
//---------------------------------//
const schedule = (() => {
	let ph, pm;
	setInterval(() => {
		const date = new Date();
		const h = date.getHours(), m = date.getMinutes();
		if(ph == h && pm == m) return;
		ph = h;
		pm = m;
		//照明
		if(h == setting.data.light.begin_time.h && m == setting.data.light.begin_time.m){
			console.log("照明 on");
			pi.send({
				method:"task",
				task:{
					task:"light",
					power:true
				}
			});
		}
		if(h == setting.data.light.end_time.h && m == setting.data.light.end_time.m){
			console.log("照明 off");
			pi.send({
				method:"task",
				task:{
					task:"light",
					power:false
				}
			});
		}

	}, 1000);
})();