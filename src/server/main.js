"use strict"
const CONFIG = require("./config");

const pi = require("./libs/pi");
const setting = require("./libs/setting");
const client = require("./libs/client");
const DB = require("./libs/db");
const db = DB.open(CONFIG.dbfile);
const db_waterlevel = require("./libs/db_waterlevel");

//設定ファイル系
setting.open(CONFIG.settingFile, {
	light:{
		begin_time:"10:00",
		end_time:"21:00"
	},
	measure:{
		interval_minutes:120
	}
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
client.open(CONFIG.wsPort);
client.on("error", () => {
	//console.log("clientとの間に何らかのエラー:(");
});
client.on("open", () => {
	console.log("client用サーバー立った");
});
client.on("connect", (reply) => {
	console.log("clientが接続してきた:)");
	reply({
		comment:"hello client"
	});
});
client.on("data", (data, reply) => {
	console.log("[clientから]");
	console.log(data);
	pi.send(data);	
});
client.on("close", (data) => {
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
	pi.send({
		comment:"hello pi"
	});
});
pi.on("data", (data) => {
	console.log("[piから]:");
	console.log(data);
	try{
	}catch(error){
	}
});
pi.on("close", (data) => {
	console.log("piとの接続は切れた:(");
});

//---------------------------------//
//スケジューリング
//---------------------------------//
const schedule = () => {

	setInterval(() => {

	}, 60 * 1000);
}