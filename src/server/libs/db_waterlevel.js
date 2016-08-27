"use strict"

const DB = require("./db");

let db;
let table;
module.exports = {
	open:(file, table) => {
		db = DB.open(file, table);
		init(table);
		this.table = table;
	},
	addData:(value) => {
		const date = new Date().getTime();
		db.run("INSERT INTO `" + this.table + "`(`date`, `value`) VALUES(?, ?)", date, value);
	},
	getDataEach:(date, count, callback) => {
		db.each("SELECT `date`, `value` FROM `"+this.table+"` WHERE " + date + " > `date` LIMIT "+count, callback);
	}
}

const init = (table) => {
	//テーブル初期化
	db.run(
		"CREATE TABLE IF NOT EXISTS `" + table + "` ( \
			`id`	INTEGER PRIMARY KEY AUTOINCREMENT, \
			`date`	INTEGER, \
			`value`	TEXT \
		)"
	);
}