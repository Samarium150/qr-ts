import * as constants from "./constants";
import * as types from "./types";
import Segment from "./Segment";
import CodePoint from "./CodePoint";
import {Codeword, DataCodeword, EcCodeword} from "./Codeword";
import RSECG from "./RSECG";
import QR from "./QR";

export namespace utils {

    export function computeModeCharCount(mode: types.Mode, version: number): number {
        return (0 < version && version <= 40) ? constants.MODE[mode].charCount[Math.floor((version + 7) / 17)] : -1;
    }
    
    export function isAlphanumeric(code: number): boolean {
        return code < 128 && constants.ALPHANUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }

    export function isNumeric(code: number): boolean {
        return code < 128 && constants.NUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }
    
    export function decToBin(n: number, length: number): Array<number> {
        if (length < 0 || length > 31 || n >>> length != 0) throw Error("Value Error");
        const result: Array<number> = [];
        for (let i = length - 1; i >= 0; i--) result.push((n >>> i) & 1);
        return result;
    }

    export function computeNumRawCodeword(version: number): number {
        let result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            const align: number = Math.floor(version / 7) + 2;
            result -= (25 * align - 10) * align - 55
            if (version >= 7) result -= 36;
        }
        return Math.floor(result / 8);
    }
    
    export function getNumEcCodeword(version: number, ecl: types.Ecl): number {
        return constants.EC_CODEWORD_PER_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    
    export function getNumEcBlocks(version: number, ecl: types.Ecl): number {
        return constants.NUM_EC_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    
    export function getCapacity(version: number, ecl: types.Ecl): number {
        return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
    }

    export function computeBitsLength(segments: Array<Segment>, version: number): number {
        let result: number = 0;
        for (const segment of segments) {
            const modeCharCountBits: number = utils.computeModeCharCount(segment.mode, version);
            if (segment.char_len >= (1 << modeCharCountBits)) return Infinity;
            result += modeCharCountBits + segment.data.length + 4;
        }
        return result;
    }

    export function computeNumCodewords(segments: Array<Segment>, version: number): number {
        return Math.ceil(computeBitsLength(segments, version) / 8);
    }

    // Step 1
    export function generateCodePoint(str: string): Array<CodePoint> {
        const result: Array<CodePoint> = [];
        for(const codePoint of str) result.push(new CodePoint(codePoint));
        return result
    }

    // Step 2
    export function generateSegmentFromSingleMode(points: Array<CodePoint>, mode: types.Mode): Segment {
        const data: Array<number> = [];
        let len: number = points.length;
        points.forEach(
            (point, index) => {
                let bits: string = "";
                switch (mode) {
                    case "NUMERIC": {
                        if (index % 3 == 0) {
                            const n = Math.min(3, points.length - index);
                            const str = points.slice(index, index + n).map(point => point.utf16_char).join("");
                            bits = parseInt(str, 10).toString(2).padStart(n * 3 + 1, "0");
                        }
                        break;
                    }
                    case "ALPHANUMERIC": {
                        let t = constants.ALPHANUMERIC.indexOf(point.utf16_char);
                        if (index % 2 == 0) {
                            const n = Math.min(2, points.length - index);
                            if (n == 2) {
                                t = t * constants.ALPHANUMERIC.length +
                                    constants.ALPHANUMERIC.indexOf(points[index + 1].utf16_char);
                            }
                            bits = t.toString(2).padStart(n * 5 + 1, "0");
                        }
                        break;
                    }
                    case "BYTE": {
                        bits = point.utf8_code.map(code => code.toString(2).toUpperCase().padStart(8, "0")).join("")
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
                for (const char of bits) data.push(parseInt(char, 2));
            }
        );
        return new Segment(mode, len, data);
    }

    function generateSegmentsFromMultiModes(points: Array<CodePoint>, modes: Array<types.Mode>): Array<Segment> {
        const result: Array<Segment> = [];
        // TODO: implement
        return result;
    }

    // Step 3
    export function computeOptimalVersion(segments: Array<Segment>, version: number, ecl: types.Ecl): number {
        let result: number = -1;
        for (let i = 1; i <= 40; i++) {
            const length = computeNumCodewords(segments, i);
            for (let key in constants.ECL) {
                if (key == ecl) {
                    const capacity = getCapacity(i, ecl);
                    if (length <= capacity && result == -1 && i >= version) {
                        result = i;
                        break;
                    }
                }
            }
        }
        return result;
    }

    // Step 4
    export function generateDataCodeword(segments: Array<Segment>, version: number, ecl: types.Ecl): Array<DataCodeword> {
        const result: Array<DataCodeword> = [], bits: Array<number> = [];
        segments.forEach(segment => {
            utils.decToBin(constants.MODE[segment.mode].indicator, 4).forEach(bit => bits.push(bit));
            utils.decToBin(segment.char_len, utils.computeModeCharCount(segment.mode, version)).forEach(bit => bits.push(bit));
            segment.data.forEach(bit => bits.push(bit));
        });
        const capacity = getCapacity(version, ecl);

        // Terminator padding
        [0, 0, 0, 0].slice(0, Math.min(4, capacity - bits.length)).forEach(bit => bits.push(bit));

        // Bit padding
        [0, 0, 0, 0, 0, 0, 0].slice(0, (8 - bits.length % 8) % 8).forEach(bit => bits.push(bit));

        // Byte padding
        const pad: Array<number> = [];
        for (let i = 0, n = (capacity - bits.length) / 8; i < n; i++) {
            if (i % 2 == 0) pad.push(1, 1, 1, 0, 1, 1, 0, 0);
            else pad.push(0, 0, 0, 1, 0, 0, 0, 1);
        }
        pad.forEach(bit => bits.push(bit));

        for (let i = 0; i < bits.length; i += 8) {
            const codeword = new DataCodeword(parseInt(bits.slice(i, i + 8).join(""), 2));
            codeword.setPreEcIndex(i / 8);
            result.push(codeword);
        }
        return result;
    }
    
    function splitData(data: Array<DataCodeword>, version: number, ecl: types.Ecl): Array<Array<DataCodeword>> {
        const num_blocks: number = getNumEcBlocks(version, ecl);
        const num_ec: number = getNumEcCodeword(version, ecl);
        const num_codewords: number = computeNumRawCodeword(version);
        const num_short_block: number = num_blocks - num_codewords % num_blocks;
        const short_block_length: number = Math.floor(num_codewords / num_blocks);

        const result: Array<Array<DataCodeword>> = [];
        for (let index = 0, off = 0; index < num_blocks; index++) {
            const end: number = off + short_block_length - num_ec + ((index < num_short_block) ? 0 : 1);
            const block: Array<DataCodeword> = data.slice(off, end);
            block.forEach((dataCodeword, i) => {
                dataCodeword.setBlockIndex(index);
                dataCodeword.setIndex(i);
            });
            result.push(block);
            off = end;
        }
        return result;
    }

    function generateEcCodeword(blocks: Array<Array<DataCodeword>>, version: number, ecl: types.Ecl): Array<Array<EcCodeword>> {
        const num_ec: number = getNumEcCodeword(version, ecl);
        const short_block_length: number = blocks[0].length;
        const ec = new RSECG(num_ec);
        let pre_inter_leave_index: number = 0;

        return blocks.map((block, index) => {
           for (let dataCodeword of block) {
               dataCodeword.setPreInterleaveIndex(pre_inter_leave_index);
               pre_inter_leave_index++;
           }
           const block_bytes: Array<number> = block.map(dataCodeWord => dataCodeWord.value);
           const ec_bytes: Array<number> = ec.getRemainder(block_bytes);
           return ec_bytes.map((byte, i) => {
               const ecCodeword = new EcCodeword(byte);
               ecCodeword.setPreInterleaveIndex(pre_inter_leave_index);
               pre_inter_leave_index++;
               ecCodeword.setBlockIndex(index);
               ecCodeword.setIndex(short_block_length + 1 + i);
               return ecCodeword;
           })
        });
    }
    
    function interleaveBlocks(data_blocks: Array<Array<DataCodeword>>, ec_blocks: Array<Array<EcCodeword>>): Array<Codeword> {
        const ec_block_length = ec_blocks[0].length;
        const data_block_length = data_blocks[data_blocks.length - 1].length;
        const result: Array<Codeword> = [];
        for (let i = 0; i < data_block_length; i++) {
            data_blocks.forEach(block => {
                if (i < block.length) {
                    const codeword = block[i];
                    codeword.setPostInterleaveIndex(result.length);
                    result.push(codeword);
                }
            });
        }
        for (let i = 0; i < ec_block_length; i++) {
            ec_blocks.forEach(block => {
                const codeword = block[i];
                codeword.setPostInterleaveIndex(result.length);
                result.push(codeword);
            })
        }
        return result;
    }

    // Step 5
    export function generateCodeword(data: Array<DataCodeword>, version: number, ecl: types.Ecl): Array<Codeword> {
        const data_blocks: Array<Array<DataCodeword>> = splitData(data, version, ecl);
        const ec_blocks: Array<Array<EcCodeword>> = generateEcCodeword(data_blocks, version, ecl);
        return interleaveBlocks(data_blocks, ec_blocks);
    }
    
    // Step 6
    export function generateRawQR(data: Array<Codeword>, version: number, ecl: types.Ecl): QR {
        const qr = new QR(version, ecl);
        const path = qr.generateDataPath();
        qr.placeCodeword(data, path);
        return qr;
    }
}