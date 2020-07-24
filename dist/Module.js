"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalModule = exports.Module = void 0;
var Module = /** @class */ (function () {
    function Module() {
        this.color = false;
    }
    Module.prototype.setColor = function (value) { this.color = value; };
    Module.prototype.getColor = function () { return this.color; };
    return Module;
}());
exports.Module = Module;
var FunctionalModule = /** @class */ (function (_super) {
    __extends(FunctionalModule, _super);
    function FunctionalModule(type, color) {
        var _this = _super.call(this) || this;
        _this.color = color;
        _this.type = type;
        return _this;
    }
    FunctionalModule.prototype.getType = function () { return this.type; };
    return FunctionalModule;
}(Module));
exports.FunctionalModule = FunctionalModule;
