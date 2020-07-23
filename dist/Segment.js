"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Segment = /** @class */ (function () {
    function Segment(mode, len, bits) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }
    return Segment;
}());
exports.default = Segment;
