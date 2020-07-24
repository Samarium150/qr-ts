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
var CodePoint_1 = __importDefault(require("./CodePoint"));
var Codeword_1 = require("./Codeword");
var RSECG_1 = __importDefault(require("./RSECG"));
var QR_1 = __importDefault(require("./QR"));
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
    function decToBin(n, length) {
        if (length < 0 || length > 31 || n >>> length != 0)
            throw Error("Value Error");
        var result = [];
        for (var i = length - 1; i >= 0; i--)
            result.push((n >>> i) & 1);
        return result;
    }
    utils.decToBin = decToBin;
    function computeNumRawCodeword(version) {
        var result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            var align = Math.floor(version / 7) + 2;
            result -= (25 * align - 10) * align - 55;
            if (version >= 7)
                result -= 36;
        }
        return Math.floor(result / 8);
    }
    utils.computeNumRawCodeword = computeNumRawCodeword;
    function getNumEcCodeword(version, ecl) {
        return constants.EC_CODEWORD_PER_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    utils.getNumEcCodeword = getNumEcCodeword;
    function getNumEcBlocks(version, ecl) {
        return constants.NUM_EC_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    utils.getNumEcBlocks = getNumEcBlocks;
    function getCapacity(version, ecl) {
        return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
    }
    utils.getCapacity = getCapacity;
    function computeBitsLength(segments, version) {
        var result = 0;
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            var modeCharCountBits = utils.computeModeCharCount(segment.mode, version);
            if (segment.char_len >= (1 << modeCharCountBits))
                return Infinity;
            result += modeCharCountBits + segment.data.length + 4;
        }
        return result;
    }
    utils.computeBitsLength = computeBitsLength;
    function computeNumCodewords(segments, version) {
        return Math.ceil(computeBitsLength(segments, version) / 8);
    }
    utils.computeNumCodewords = computeNumCodewords;
    // Step 1
    function generateCodePoint(str) {
        var result = [];
        for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
            var codePoint = str_1[_i];
            result.push(new CodePoint_1.default(codePoint));
        }
        return result;
    }
    utils.generateCodePoint = generateCodePoint;
    // Step 2
    function generateSegmentFromSingleMode(points, mode) {
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
        return new Segment_1.default(mode, len, data);
    }
    utils.generateSegmentFromSingleMode = generateSegmentFromSingleMode;
    function generateSegmentsFromMultiModes(points, modes) {
        var result = [];
        // TODO: implement
        return result;
    }
    // Step 3
    function computeOptimalVersion(segments, version, ecl) {
        var result = -1;
        for (var i = 1; i <= 40; i++) {
            var length_1 = computeNumCodewords(segments, i);
            for (var key in constants.ECL) {
                if (key == ecl) {
                    var capacity = getCapacity(i, ecl);
                    if (length_1 <= capacity && result == -1 && i >= version) {
                        result = i;
                        break;
                    }
                }
            }
        }
        return result;
    }
    utils.computeOptimalVersion = computeOptimalVersion;
    // Step 4
    function generateDataCodeword(segments, version, ecl) {
        var result = [], bits = [];
        segments.forEach(function (segment) {
            utils.decToBin(constants.MODE[segment.mode].indicator, 4).forEach(function (bit) { return bits.push(bit); });
            utils.decToBin(segment.char_len, utils.computeModeCharCount(segment.mode, version)).forEach(function (bit) { return bits.push(bit); });
            segment.data.forEach(function (bit) { return bits.push(bit); });
        });
        var capacity = getCapacity(version, ecl);
        // Terminator padding
        [0, 0, 0, 0].slice(0, Math.min(4, capacity - bits.length)).forEach(function (bit) { return bits.push(bit); });
        // Bit padding
        [0, 0, 0, 0, 0, 0, 0].slice(0, (8 - bits.length % 8) % 8).forEach(function (bit) { return bits.push(bit); });
        // Byte padding
        var pad = [];
        for (var i = 0, n = (capacity - bits.length) / 8; i < n; i++) {
            if (i % 2 == 0)
                pad.push(1, 1, 1, 0, 1, 1, 0, 0);
            else
                pad.push(0, 0, 0, 1, 0, 0, 0, 1);
        }
        pad.forEach(function (bit) { return bits.push(bit); });
        for (var i = 0; i < bits.length; i += 8) {
            var codeword = new Codeword_1.DataCodeword(parseInt(bits.slice(i, i + 8).join(""), 2));
            codeword.setPreEcIndex(i / 8);
            result.push(codeword);
        }
        return result;
    }
    utils.generateDataCodeword = generateDataCodeword;
    function splitData(data, version, ecl) {
        var num_blocks = getNumEcBlocks(version, ecl);
        var num_ec = getNumEcCodeword(version, ecl);
        var num_codewords = computeNumRawCodeword(version);
        var num_short_block = num_blocks - num_codewords % num_blocks;
        var short_block_length = Math.floor(num_codewords / num_blocks);
        var result = [];
        var _loop_1 = function (index, off) {
            var end = off + short_block_length - num_ec + ((index < num_short_block) ? 0 : 1);
            var block = data.slice(off, end);
            block.forEach(function (dataCodeword, i) {
                dataCodeword.setBlockIndex(index);
                dataCodeword.setIndex(i);
            });
            result.push(block);
            off = end;
            out_off_1 = off;
        };
        var out_off_1;
        for (var index = 0, off = 0; index < num_blocks; index++) {
            _loop_1(index, off);
            off = out_off_1;
        }
        return result;
    }
    function generateEcCodeword(blocks, version, ecl) {
        var num_ec = getNumEcCodeword(version, ecl);
        var short_block_length = blocks[0].length;
        var ec = new RSECG_1.default(num_ec);
        var pre_inter_leave_index = 0;
        return blocks.map(function (block, index) {
            for (var _i = 0, block_1 = block; _i < block_1.length; _i++) {
                var dataCodeword = block_1[_i];
                dataCodeword.setPreInterleaveIndex(pre_inter_leave_index);
                pre_inter_leave_index++;
            }
            var block_bytes = block.map(function (dataCodeWord) { return dataCodeWord.value; });
            var ec_bytes = ec.getRemainder(block_bytes);
            return ec_bytes.map(function (byte, i) {
                var ecCodeword = new Codeword_1.EcCodeword(byte);
                ecCodeword.setPreInterleaveIndex(pre_inter_leave_index);
                pre_inter_leave_index++;
                ecCodeword.setBlockIndex(index);
                ecCodeword.setIndex(short_block_length + 1 + i);
                return ecCodeword;
            });
        });
    }
    function interleaveBlocks(data_blocks, ec_blocks) {
        var ec_block_length = ec_blocks[0].length;
        var data_block_length = data_blocks[data_blocks.length - 1].length;
        var result = [];
        var _loop_2 = function (i) {
            data_blocks.forEach(function (block) {
                if (i < block.length) {
                    var codeword = block[i];
                    codeword.setPostInterleaveIndex(result.length);
                    result.push(codeword);
                }
            });
        };
        for (var i = 0; i < data_block_length; i++) {
            _loop_2(i);
        }
        var _loop_3 = function (i) {
            ec_blocks.forEach(function (block) {
                var codeword = block[i];
                codeword.setPostInterleaveIndex(result.length);
                result.push(codeword);
            });
        };
        for (var i = 0; i < ec_block_length; i++) {
            _loop_3(i);
        }
        return result;
    }
    // Step 5
    function generateCodeword(data, version, ecl) {
        var data_blocks = splitData(data, version, ecl);
        var ec_blocks = generateEcCodeword(data_blocks, version, ecl);
        return interleaveBlocks(data_blocks, ec_blocks);
    }
    utils.generateCodeword = generateCodeword;
    // Step 6
    function generateRawQR(data, version, ecl) {
        var qr = new QR_1.default(version, ecl);
        var path = qr.generateDataPath();
        qr.placeCodeword(data, path);
        return qr;
    }
    utils.generateRawQR = generateRawQR;
})(utils = exports.utils || (exports.utils = {}));
