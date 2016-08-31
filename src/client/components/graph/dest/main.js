"use strict";
var canvas_1 = require("./canvas");
var init = function () {
    var parent = document.getElementById("sample");
    var canvas = new canvas_1.Canvas(parent);
    alert(1);
};
window.addEventListener("load", init);
