(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Canvas = (function (_super) {
    __extends(Canvas, _super);
    function Canvas(parentElement) {
        var _this = this;
        var canvasElement = document.createElement("canvas");
        canvasElement.style.width = "100%";
        canvasElement.style.height = "100%";
        _super.call(this, canvasElement);
        this._parentElement = parentElement;
        this._canvasElement = canvasElement;
        parentElement.appendChild(this._canvasElement);
        this._corner = new createjs.Shape();
        this.addChild(this._corner);
        this.fitToParent();
        window.addEventListener("resize", function () {
            _this.fitToParent();
        });
    }
    Canvas.prototype.fitToParent = function () {
        var rect = this._parentElement.getBoundingClientRect();
        this._width = this._canvasElement.width = rect.width * 2;
        this._height = this._canvasElement.height = rect.height * 2;
        this._corner.graphics.clear();
        this._corner.graphics.beginFill("#FF0000");
        this._corner.graphics.drawRect(0, 0, 10, 10);
        this._corner.graphics.drawRect(this._width - 10, this._height - 10, 10, 10);
        this.onResize(this._width, this._height);
        this.update();
    };
    Canvas.prototype.onResize = function (width, height) {
    };
    return Canvas;
}(createjs.Stage));
exports.Canvas = Canvas;

},{}],2:[function(require,module,exports){
"use strict";
var canvas_1 = require("./canvas");
var init = function () {
    var parent = document.getElementById("sample");
    var canvas = new canvas_1.Canvas(parent);
    alert(1);
};
window.addEventListener("load", init);

},{"./canvas":1}]},{},[2]);
