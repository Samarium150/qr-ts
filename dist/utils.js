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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
var constants = __importStar(require("./constants"));
var Segment_1 = __importDefault(require("./Segment"));
var utils;
(function (utils) {
    function computeModeCharCount(mode, version) {
        return (0 < version && version <= 40) ? constants.MODE[mode].charCount[Math.floor((version + 7) / 17)] : -1;
    }
    utils.computeModeCharCount = computeModeCharCount;
    function isAlphanumeric(code) {
        return code < 128 && constants.ALPHANUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }
    utils.isAlphanumeric = isAlphanumeric;
    function isNumeric(code) {
        return code < 128 && constants.NUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }
    utils.isNumeric = isNumeric;
    function computeNumRawDataModule(version) {
        var result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            var align = Math.floor(version / 7) + 2;
            result -= (25 * align - 10) * align - 55;
            if (version >= 7)
                result -= 36;
        }
        return result;
    }
    function getCapacity(version, ecl) {
        return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
    }
    function computeOptimalVersion(segments, version, ecl) {
        var result = -1;
        for (var i = 1; i <= 40; i++) {
            var len = Segment_1.default.computeNumCodewords(segments, i);
            for (var key in constants.ECL) {
                if (key == ecl) {
                    var capacity = getCapacity(i, ecl);
                    if (len <= capacity && result == -1 && i >= version) {
                        result = i;
                        break;
                    }
                }
            }
        }
        return result;
    }
    utils.computeOptimalVersion = computeOptimalVersion;
})(utils = exports.utils || (exports.utils = {}));
