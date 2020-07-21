"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var constants = __importStar(require("./constants"));
var Segment = /** @class */ (function () {
    function Segment(mode, len, bits) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }
    Segment.computeBitsLength = function (segments, version) {
        var result = 0;
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            var modeCharCountBits = utils_1.utils.computeModeCharCount(segment.mode, version);
            if (segment.char_len >= (1 << modeCharCountBits))
                return Infinity;
            result += modeCharCountBits + segment.data.length + 4;
        }
        return result;
    };
    Segment.computeNumCodewords = function (segments, version) {
        return Math.ceil(Segment.computeBitsLength(segments, version) / 8);
    };
    Segment.generateFromSingleMode = function (points, mode) {
        var data = [];
        var len = points.length;
        points.forEach(function (point, index) {
            var bits = "";
            switch (mode) {
                case "NUMERIC": {
                    if (index % 3 == 0) {
                        var n = Math.min(3, points.length - index);
                        var str = points.slice(index, index + n).map(function (point) { return point.utf16_char; }).join("");
                        bits = parseInt(str, 10).toString(2).padStart(n * 3 + 1, "0");
                    }
                    break;
                }
                case "ALPHANUMERIC": {
                    var t = constants.ALPHANUMERIC.indexOf(point.utf16_char);
                    if (index % 2 == 0) {
                        var n = Math.min(2, points.length - index);
                        if (n == 2) {
                            t = t * constants.ALPHANUMERIC.length +
                                constants.ALPHANUMERIC.indexOf(points[index + 1].utf16_char);
                        }
                        bits = t.toString(2).padStart(n * 5 + 1, "0");
                    }
                    break;
                }
                case "BYTE": {
                    bits = point.utf8_code.map(function (code) { return code.toString(2).toUpperCase().padStart(8, "0"); }).join("");
                    len += point.utf8_code.length - 1;
                    break;
                }
                case "KANJI": {
                    // TODO: implement
                    break;
                }
                default:
                    throw Error("Invalid encoding mode");
            }
            for (var _i = 0, bits_1 = bits; _i < bits_1.length; _i++) {
                var char = bits_1[_i];
                data.push(parseInt(char, 2));
            }
        });
        return new Segment(mode, len, data);
    };
    Segment.generateFromMultiModes = function (points, modes) {
        var result = [];
        return result;
    };
    return Segment;
}());
exports.default = Segment;
