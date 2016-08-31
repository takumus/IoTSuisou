import {Canvas} from "./canvas";
const init = () => {
	const parent = document.getElementById("sample");
	const canvas:Canvas = new Canvas(parent);
	alert(1);
}
window.addEventListener("load", init);