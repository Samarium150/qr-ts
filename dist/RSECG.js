"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RSECG = /** @class */ (function () {
    function RSECG(degree) {
        this.coefficients = [];
        if (degree < 1 || degree > 255)
            throw Error("Degree out of range");
        var coefs = this.coefficients;
        for (var i = 0; i < degree - 1; i++)
            coefs.push(0);
        coefs.push(1);
        var root = 1;
        for (var i = 0; i < degree; i++) {
            for (var j = 0; j < coefs.length; j++) {
                coefs[j] = RSECG.multiply(coefs[j], root);
                if (j + 1 < coefs.length)
                    coefs[j] ^= coefs[j + 1];
            }
            root = RSECG.multiply(root, 0x02);
        }
    }
    RSECG.multiply = function (a, b) {
        if (a >>> 8 != 0 || b >>> 8 != 0)
            throw Error("Invalid bytes");
        var n = 0;
        for (var i = 7; i >= 0; i--) {
            n = (n << 1) ^ ((n >>> 7) * 0x11D);
            n ^= ((b >>> i) & 1) * a;
        }
        if (n >>> 8 != 0)
            throw Error("Calculation error");
        return n;
    };
    RSECG.prototype.getRemainder = function (data) {
        var result = this.coefficients.map(function (_) { return 0; });
        var _loop_1 = function (byte) {
            var f = byte ^ result.shift();
            result.push(0);
            this_1.coefficients.forEach(function (coefficient, index) {
                result[index] ^= RSECG.multiply(coefficient, f);
            });
        };
        var this_1 = this;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var byte = data_1[_i];
            _loop_1(byte);
        }
        return result;
    };
    return RSECG;
}());
exports.default = RSECG;
