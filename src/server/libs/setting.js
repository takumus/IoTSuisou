"use strict"
const fs = require("fs");
let data;
let path;
module.exports = {
	open:(path, defaultData) => {
		this.path = path;
		try{
			module.exports.data = JSON.parse(fs.readFileSync(path));
		}catch(error){
			const dataStr = JSON.stringify(defaultData);
			module.exports.data = JSON.parse(dataStr);
			fs.writeFile(this.path, dataStr);
		}
	},
	save:() => {
		fs.writeFile(this.path, JSON.stringify(module.exports.data));
	}
}