"use strict"
const sqlite3 = require("sqlite3");
sqlite3.verbose();
module.exports = {
	open:(file) => {
		const sqlite = new sqlite3.Database(file);
		sqlite.serialize();
		return sqlite;
	}
}