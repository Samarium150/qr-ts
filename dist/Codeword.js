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
exports.EcCodeword = exports.DataCodeword = exports.Codeword = void 0;
var Codeword = /** @class */ (function () {
    function Codeword(value) {
        this.pre_interleave_index = -1;
        this.block_index = -1;
        this.index = -1;
        this.post_interleave_index = -1;
        if (value < 0 || value >= 255)
            throw Error("Invalid Value");
        this.value = value;
    }
    Codeword.prototype.setBlockIndex = function (value) { this.block_index = value; };
    Codeword.prototype.setIndex = function (value) { this.index = value; };
    Codeword.prototype.setPreInterleaveIndex = function (value) { this.pre_interleave_index = value; };
    Codeword.prototype.setPostInterleaveIndex = function (value) { this.post_interleave_index = value; };
    return Codeword;
}());
exports.Codeword = Codeword;
var DataCodeword = /** @class */ (function (_super) {
    __extends(DataCodeword, _super);
    function DataCodeword(value) {
        var _this = _super.call(this, value) || this;
        _this.pre_ec_index = -1;
        return _this;
    }
    DataCodeword.prototype.setPreEcIndex = function (n) {
        this.pre_ec_index = n;
    };
    return DataCodeword;
}(Codeword));
exports.DataCodeword = DataCodeword;
var EcCodeword = /** @class */ (function (_super) {
    __extends(EcCodeword, _super);
    function EcCodeword(value) {
        return _super.call(this, value) || this;
    }
    return EcCodeword;
}(Codeword));
exports.EcCodeword = EcCodeword;
