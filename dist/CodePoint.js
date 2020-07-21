"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CodePoint = /** @class */ (function () {
    function CodePoint(codePoint) {
        this.utf16_char = codePoint;
        this.utf8_code = CodePoint.toUTF8Array(codePoint);
    }
    // source: https://gist.github.com/joni/3760795#file-toutf8array-js
    CodePoint.toUTF8Array = function (str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var char_code = str.charCodeAt(i);
            if (char_code < 0x80)
                utf8.push(char_code);
            else if (char_code < 0x800) {
                utf8.push(0xc0 | (char_code >> 6), 0x80 | (char_code & 0x3f));
            }
            else if (char_code < 0xd800 || char_code >= 0xe000) {
                utf8.push(0xe0 | (char_code >> 12), 0x80 | ((char_code >> 6) & 0x3f), 0x80 | (char_code & 0x3f));
            }
            // surrogate pair
            else {
                char_code = ((char_code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff) + 0x010000;
                utf8.push(0xf0 | (char_code >> 18), 0x80 | ((char_code >> 12) & 0x3f), 0x80 | ((char_code >> 6) & 0x3f), 0x80 | (char_code & 0x3f));
            }
        }
        return utf8;
    };
    CodePoint.generate = function (str) {
        var result = [];
        for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
            var codePoint = str_1[_i];
            result.push(new CodePoint(codePoint));
        }
        return result;
    };
    return CodePoint;
}());
exports.default = CodePoint;
