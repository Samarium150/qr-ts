import * as constants from "./constants";
import * as types from "./types";
import * as _ from "lodash";
import Segment from "./Segment";
import CodePoint from "./CodePoint";
import {Codeword, DataCodeword, EcCodeword} from "./Codeword";
import RSECG from "./RSECG";
import QR from "./QR";

export namespace utils {

    function computeModeCharCount(mode: types.Mode, version: number): number {
        return (0 < version && version <= 40) ? constants.MODE[mode].charCount[Math.floor((version + 7) / 17)] : -1;
    }
    
    export function isAlphanumeric(char: string): boolean {
        return constants.ALPHANUMERIC.indexOf(char) != -1;
    }

    export function isNumeric(char: string): boolean {
        return constants.NUMERIC.indexOf(char) != -1;
    }
    
    function decToBin(n: number, length: number): Array<number> {
        if (length < 0 || length > 31 || n >>> length != 0) throw Error("Value Error");
        const result: Array<number> = [];
        for (let i: number = length - 1; i >= 0; i--) result.push((n >>> i) & 1);
        return result;
    }

    function computeNumRawCodeword(version: number): number {
        let result: number = (16 * version + 128) * version + 64;
        if (version >= 2) {
            const align: number = Math.floor(version / 7) + 2;
            result -= (25 * align - 10) * align - 55
            if (version >= 7) result -= 36;
        }
        return Math.floor(result / 8);
    }
    
    function getNumEcCodeword(version: number, ecl: types.Ecl): number {
        return constants.EC_CODEWORD_PER_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    
    function getNumEcBlocks(version: number, ecl: types.Ecl): number {
        return constants.NUM_EC_BLOCK[constants.ECL[ecl].ordinal][version];
    }
    
    function getCapacity(version: number, ecl: types.Ecl): number {
        return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
    }

    function computeBitsLength(segments: Array<Segment>, version: number): number {
        let result: number = 0;
        for (const segment of segments) {
            const modeCharCountBits: number = computeModeCharCount(segment.getMode(), version);
            if (segment.getCharLen() >= (1 << modeCharCountBits)) throw Error("Cannot Encode");
            result += modeCharCountBits + segment.getData().length + 4;
        }
        return result;
    }

    function computeNumCodewords(segments: Array<Segment>, version: number): number {
        return Math.ceil(computeBitsLength(segments, version) / 8);
    }

    // Step 1
    export function generateCodePoint(str: string): Array<CodePoint> {
        const result: Array<CodePoint> = [];
        for (const codePoint of str) result.push(new CodePoint(codePoint));
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
                            const n: number = Math.min(3, points.length - index);
                            const str: string = points.slice(index, index + n).map(point => point.getChar()).join("");
                            bits = parseInt(str, 10).toString(2).padStart(n * 3 + 1, "0");
                        }
                        break;
                    }
                    case "ALPHANUMERIC": {
                        let t: number = constants.ALPHANUMERIC.indexOf(point.getChar());
                        if (index % 2 == 0) {
                            const n: number = Math.min(2, points.length - index);
                            if (n == 2) {
                                t = t * constants.ALPHANUMERIC.length +
                                    constants.ALPHANUMERIC.indexOf(points[index + 1].getChar());
                            }
                            bits = t.toString(2).padStart(n * 5 + 1, "0");
                        }
                        break;
                    }
                    case "BYTE": {
                        bits = point.getCode().map(code => code.toString(2).toUpperCase().padStart(8, "0")).join("")
                        len += point.getCode().length - 1;
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

    export function generateSegmentsFromMultiModes(points: Array<CodePoint>, modes: Array<types.Mode>): Array<Segment> {
        // TODO: implement
        return [];
    }

    // Step 3
    export function computeOptimalVersion(segments: Array<Segment>, version: number, ecl: types.Ecl, forced: boolean): number {
        if (forced) {
            const capacity: number = getCapacity(version, ecl),
                length: number = computeNumCodewords(segments, version);
            if (capacity < length) throw Error("Cannot Encode At This Version");
            return version;
        }
        let result: number = -1;
        for (let i: number = 1; i <= 40; i++) {
            const length: number = computeNumCodewords(segments, i);
            for (let key in constants.ECL) {
                if (key == ecl) {
                    const capacity: number = getCapacity(i, ecl);
                    if (length <= capacity && result == -1 && i >= version) {
                        result = i;
                        break;
                    }
                }
            }
        }
        if (result == -1) throw Error("Cannot Encode");
        return result;
    }

    // Step 4
    export function generateDataCodeword(segments: Array<Segment>, version: number, ecl: types.Ecl): Array<DataCodeword> {
        const result: Array<DataCodeword> = [], bits: Array<number> = [],
            terminator: Array<number> = [0, 0, 0, 0], bitPad: Array<number> = [0, 0, 0, 0, 0, 0, 0];
        segments.forEach(segment => {
            decToBin(constants.MODE[segment.getMode()].indicator, 4).forEach(bit => bits.push(bit));
            decToBin(segment.getCharLen(), computeModeCharCount(segment.getMode(), version)).forEach(bit => bits.push(bit));
            segment.getData().forEach(bit => bits.push(bit));
        });
        const capacity: number = getCapacity(version, ecl) * 8;

        // Terminator padding
        terminator.slice(0, Math.min(4, capacity - bits.length)).forEach(bit => bits.push(bit));

        // Bit padding
        bitPad.slice(0, (8 - bits.length % 8) % 8).forEach(bit => bits.push(bit));

        // Byte padding
        const pad: Array<number> = [];
        for (let i: number = 0, n = (capacity - bits.length) / 8; i < n; i++) {
            if (i % 2 == 0) pad.push(1, 1, 1, 0, 1, 1, 0, 0);
            else pad.push(0, 0, 0, 1, 0, 0, 0, 1);
        }
        pad.forEach(bit => bits.push(bit));

        for (let i: number = 0; i < bits.length; i += 8) {
            const codeword: DataCodeword = new DataCodeword(parseInt(bits.slice(i, i + 8).join(""), 2));
            codeword.setPreEcIndex(i / 8);
            result.push(codeword);
        }
        return result;
    }
    
    function splitData(data: Array<DataCodeword>, version: number, ecl: types.Ecl): Array<Array<DataCodeword>> {
        const num_blocks: number = getNumEcBlocks(version, ecl),
            num_ec: number = getNumEcCodeword(version, ecl),
            num_codewords: number = computeNumRawCodeword(version),
            num_short_block: number = num_blocks - num_codewords % num_blocks,
            short_block_length: number = Math.floor(num_codewords / num_blocks),
            result: Array<Array<DataCodeword>> = [];

        for (let index: number = 0, off = 0; index < num_blocks; index++) {
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
        const num_ec: number = getNumEcCodeword(version, ecl),
            short_block_length: number = blocks[0].length,
            ec: RSECG = new RSECG(num_ec);
        let pre_inter_leave_index: number = 0;

        return blocks.map((block, index) => {
           for (let dataCodeword of block) {
               dataCodeword.setPreInterleaveIndex(pre_inter_leave_index);
               pre_inter_leave_index++;
           }
           const block_bytes: Array<number> = block.map(dataCodeWord => dataCodeWord.getValue()),
               ec_bytes: Array<number> = ec.getRemainder(block_bytes);
           return ec_bytes.map((byte, i) => {
               const ecCodeword: EcCodeword = new EcCodeword(byte);
               ecCodeword.setPreInterleaveIndex(pre_inter_leave_index);
               pre_inter_leave_index++;
               ecCodeword.setBlockIndex(index);
               ecCodeword.setIndex(short_block_length + 1 + i);
               return ecCodeword;
           })
        });
    }
    
    function interleaveBlocks(data_blocks: Array<Array<DataCodeword>>, ec_blocks: Array<Array<EcCodeword>>): Array<Codeword> {
        const ec_block_length: number = ec_blocks[0].length,
            data_block_length: number = data_blocks[data_blocks.length - 1].length,
            result: Array<Codeword> = [];
        for (let i: number = 0; i < data_block_length; i++) {
            data_blocks.forEach(block => {
                if (i < block.length) {
                    const codeword: Codeword = block[i];
                    codeword.setPostInterleaveIndex(result.length);
                    result.push(codeword);
                }
            });
        }
        for (let i: number = 0; i < ec_block_length; i++) {
            ec_blocks.forEach(block => {
                const codeword: Codeword = block[i];
                codeword.setPostInterleaveIndex(result.length);
                result.push(codeword);
            })
        }
        return result;
    }

    // Step 5
    export function generateCodeword(data: Array<DataCodeword>, version: number, ecl: types.Ecl): Array<Codeword> {
        const data_blocks: Array<Array<DataCodeword>> = splitData(data, version, ecl),
            ec_blocks: Array<Array<EcCodeword>> = generateEcCodeword(data_blocks, version, ecl);
        return interleaveBlocks(data_blocks, ec_blocks);
    }
    
    // Step 6
    export function generateRawQR(data: Array<Codeword>, version: number, ecl: types.Ecl): QR {
        const qr: QR = new QR(version, ecl);
        qr.initialize();
        const path: Array<types.Position> = qr.generateDataPath();
        qr.placeCodeword(data, path);
        return qr;
    }

    // Step 7
    export function computeOptimalMask(qr: QR): [number, QR] {
        const masks: Array<QR> = qr.generateAllMasks(),
            values: Array<number> = masks.map((mask, index) => {
            // TODO: find another way to deep copy
            const copy = _.cloneDeep(qr);
            copy.applyMask(mask);
            copy.drawFormatPatterns(index);
            return copy.computePenalty();
        }),
            which: number = values.indexOf(Math.min(...values));
        return [which, masks[which]];
    }

    // Step 8
    export function generateQR(qr: QR, mask: [number, QR]) {
        qr.applyMask(mask[1]);
        qr.drawFormatPatterns(mask[0]);
    }
}
