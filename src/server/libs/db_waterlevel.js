"use strict"

let _db;
let table;
module.exports = {
	open:(db, table) => {
		_db = db;
		init(table);
		this.table = table;
	},
	addData:(value) => {
		const date = new Date().getTime();
		_db.run("INSERT INTO `" + this.table + "`(`date`, `value`) VALUES(?, ?)", date, value);
	},
	getData:(date, count, each, complete) => {
		_db.each("SELECT `date`, `value` FROM `"+this.table+"` WHERE " + date + " > `date` ORDER BY id DESC LIMIT "+count, each, complete);
	}
}

const init = (table) => {
	//テーブル初期化
	_db.run(
		"CREATE TABLE IF NOT EXISTS `" + table + "` ( \
			`id`	INTEGER PRIMARY KEY AUTOINCREMENT, \
			`date`	INTEGER, \
			`value`	TEXT \
		)"
	);
}