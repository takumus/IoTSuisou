///<reference path="../d.ts/createjs/createjs.d.ts"/>
export class Canvas extends createjs.Stage{
	private _canvasElement:HTMLCanvasElement;
	private _parentElement:HTMLElement;
	private _corner:createjs.Shape;
	private _width:number;
	private _height:number;
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
		this._width = this._canvasElement.width = rect.width * 2;
		this._height = this._canvasElement.height = rect.height * 2;

		///*ちゃんのサイズが取れてるかどうかテスト
		this._corner.graphics.clear();
		this._corner.graphics.beginFill("#FF0000");
		this._corner.graphics.drawRect(0, 0, 10, 10);
		this._corner.graphics.drawRect(this._width - 10, this._height - 10, 10, 10);
		//*/

		//stage.update()でcanvasのサイズにフィット
		this.onResize(this._width, this._height);
		this.update();
	}
	public onResize(width:number, height:number):void{

	}
}