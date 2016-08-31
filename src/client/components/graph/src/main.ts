///<reference path="../d.ts/createjs/createjs.d.ts"/>
const init = () => {
	const parent = document.getElementById("sample");
	let canvas = new Canvas(parent);
}

window.addEventListener("load", init);
class Canvas extends createjs.Stage{
	private _canvasElement:HTMLCanvasElement;
	private _parentElement:HTMLElement;
	private _corner:createjs.Shape;
	constructor(parentElement:HTMLElement){
		const canvasElement = document.createElement("canvas");
		canvasElement.style.width = "100%";
		canvasElement.style.height = "100%";
		super(canvasElement);
		this._parentElement = parentElement;
		this._canvasElement = canvasElement;
		//canvasを追加
		parentElement.appendChild(this._canvasElement);

		this._corner = new createjs.Shape();
		this.addChild(this._corner);
		this.fitToParent();
		window.addEventListener("resize", ()=>{
			this.fitToParent();
		})
	}
	public fitToParent():void{
		const rect = this._parentElement.getBoundingClientRect();
		const width = rect.width * 2;
		const height = rect.height * 2;

		this._canvasElement.width = width;
		this._canvasElement.height = height;
		this._corner.graphics.clear();
		this._corner.graphics.beginFill("#FF0000");
		this._corner.graphics.drawRect(0, 0, 10, 10);
		this._corner.graphics.drawRect(width - 10, height - 10, 10, 10);
		this.update();
	}
}