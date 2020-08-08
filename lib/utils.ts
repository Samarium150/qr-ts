import * as constants from "./constants";
import {Mode, Version, Ecl, Position} from "./types";
import Segment from "./Segment";
import CodePoint from "./CodePoint";
import {Codeword, DataCodeword, EcCodeword} from "./Codeword";
import RSECG from "./RSECG";
import QR from "./QR";
import emoji_regex from "emoji-regex";
import {convert} from "encoding-japanese";


function computeModeCharCount(mode: Mode, version: Version): number {
    return constants.MODE[mode].charCount[Math.floor((version + 7) / 17)];
}

function isAlphanumeric(char: string): boolean {
    return constants.ALPHANUMERIC.indexOf(char) != -1;
}

function isNumeric(char: string): boolean {
    return constants.NUMERIC.indexOf(char) != -1;
}

function isKanji(char: string): boolean {
    return (convert(char, {to: "SJIS", type: "array"}) as Array<number>).indexOf(63) == -1;
}

function decToBin(n: number, length: number): Array<number> {
    if (length < 0 || length > 31 || n >>> length != 0) throw Error("Value Error");
    const result: Array<number> = [];
    for (let i: number = length - 1; i >= 0; i--) result.push((n >>> i) & 1);
    return result;
}

function computeNumRawCodeword(version: Version): number {
    let result: number = (16 * version + 128) * version + 64;
    if (version >= 2) {
        const align: number = Math.floor(version / 7) + 2;
        result -= (25 * align - 10) * align - 55;
        if (version >= 7) result -= 36;
    }
    return Math.floor(result / 8);
}

function getNumEcCodeword(version: Version, ecl: Ecl): number {
    return constants.EC_CODEWORD_PER_BLOCK[constants.ECL[ecl].ordinal][version];
}

function getNumEcBlocks(version: Version, ecl: Ecl): number {
    return constants.NUM_EC_BLOCK[constants.ECL[ecl].ordinal][version];
}

function getCapacity(version: Version, ecl: Ecl): number {
    return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
}

function computeBitsLength(segments: Array<Segment>, version: Version): number {
    let result = 0;
    for (const segment of segments) {
        const modeCharCountBits: number = computeModeCharCount(segment.getMode(), version);
        if (segment.getCharLen() >= (1 << modeCharCountBits)) throw Error("Cannot Encode");
        result += modeCharCountBits + segment.getData().length + 4;
    }
    return result;
}

function computeNumCodewords(segments: Array<Segment>, version: Version): number {
    return Math.ceil(computeBitsLength(segments, version) / 8);
}

// Step 1
function generateCodePoint(str: string): Array<CodePoint> {
    const regex: RegExp = emoji_regex(),
        points: Array<CodePoint> = [];
    if (str.search(regex) != -1) {
        const break_points: Array<number> = [], indices: Array<number> = [];
        let result: RegExpExecArray | null = regex.exec(str);
        while (result) {
            indices.push(result.index);
            if (break_points[break_points.length - 1] != result.index) break_points.push(result.index);
            break_points.push(result.index+result[0].length);
            result = regex.exec(str);
        }
        break_points.push(str.length);
        for (let i = 0; i < break_points.length - 1; i++) {
            const sub: string = str.substring(break_points[i], break_points[i+1]);
            if (indices.indexOf(break_points[i]) != -1) points.push(new CodePoint(sub));
            else for (const c of sub) points.push(new CodePoint(c));
        }
    } else for (const c of str) points.push(new CodePoint(c));
    return points;
}

// Step 2
function generateSegmentFromSingleMode(points: Array<CodePoint>, mode: Mode): Segment {
    const data: Array<number> = [];
    let len: number = points.length;
    points.forEach(
        (point, index) => {
            let bits = "";
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
                    bits = point.getCode().map(code => code.toString(2).toUpperCase().padStart(8, "0")).join("");
                    len += point.getCode().length - 1;
                    break;
                }
                case "KANJI": {
                    const codes: Array<number> = convert(point.getChar(), {to: "SJIS", type: "array"}) as Array<number>,
                        rep: number = parseInt(codes.map(code=>code.toString(16)).join(""), 16),
                        temp: string = (constants.KANJI.A <= rep && rep <= constants.KANJI.B) ?
                            (rep - constants.KANJI.A).toString(16).padStart(4, "0") :
                            (constants.KANJI.C <= rep && rep <= constants.KANJI.D) ?
                                (rep - constants.KANJI.E).toString(16).padStart(4, "0") : "";
                    if (temp.length == 0) throw Error("Kanji Encoding Error");
                    const msb = parseInt(temp.substring(0, 2), 16),
                        lsb = parseInt(temp.substring(2, 4), 16);
                    bits = (msb * constants.KANJI.factor + lsb).toString(2).padStart(13, "0");
                    break;
                }
                default:
                    throw Error("Invalid Encoding Mode");
            }
            for (const bit of bits) data.push(parseInt(bit, 2));
        }
    );
    return new Segment(mode, len, data);
}

function generateSegmentsFromMultiModes(points: Array<CodePoint>, modes: Array<Mode>): Array<Segment> {
    const queue: Array<[Mode, Array<CodePoint>]> = [];
    let i = 1, mode: Mode = modes[0];
    const indices: Array<number> = [0], ms: Array<Mode> = [mode];
    while (i < points.length) {
        if (modes[i] != mode) {
            indices.push(i);
            mode = modes[i];
            ms.push(mode);
        }
        i++;
    }
    indices.push(points.length);
    i = 0;
    while (i < indices.length - 1) {
        queue.push([ms[i], points.slice(indices[i], indices[i+1])]);
        i++;
    }
    return queue.map(req => generateSegmentFromSingleMode(req[1], req[0]));
}

// source: https://github.com/nayuki/Nayuki-web-published-code/blob/master/optimal-text-segmentation-for-qr-codes/qr-code-optimal-text-segmentation.ts#L227
function computeOptimalEncodingMode(points: Array<CodePoint>, version: Version): Array<Mode> {
    const modes: Array<Mode> = ["BYTE", "ALPHANUMERIC", "NUMERIC", "KANJI"],
        header: Array<number> = modes.map(mode => 4 + computeModeCharCount(mode, version) * 6),
        charModes: Array<Array<Mode>> = [];
    let prev: Array<number> = header.slice();
    points.forEach(point => {
        const ms: Array<Mode|null> = modes.map(() => null),
            curr: Array<number> = modes.map(() => Infinity);
        ms[0] = "BYTE";
        curr[0] = prev[0] + 48 * point.getCode().length;
        if (isAlphanumeric(point.getChar())) {
            ms[1] = "ALPHANUMERIC";
            curr[1] = prev[1] + 33;
        }
        if (isNumeric(point.getChar())) {
            ms[2] = "NUMERIC";
            curr[2] = prev[2] + 20;
        }
        if (isKanji(point.getChar())) {
            ms[3] = "KANJI";
            curr[3] = prev[3] + 78;
        }
        modes.forEach((_, i) =>
            modes.forEach((mode, j) => {
                const cost: number = Math.ceil(curr[j] / 6) * 6 + header[i];
                if (ms[j] && cost < curr[i]) {
                    curr[i] = cost;
                    ms[i] = mode;
                }
            })
        );
        charModes.push(ms as Array<Mode>);
        prev = curr;
    });
    let index = 0;
    modes.forEach((_, i) =>
        (prev[i] < prev[index]) ? index = i : index
    );
    const result: Array<Mode> = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const mode: Mode = charModes[i][index];
        index = modes.indexOf(mode);
        result.push(mode);
    }
    return result.reverse();
}

// Step 3
function computeOptimalVersion(segments: Array<Segment>, version: Version, ecl: Ecl, forced: boolean): Version {
    if (forced) {
        const capacity: number = getCapacity(version, ecl),
            length: number = computeNumCodewords(segments, version);
        if (capacity < length) throw Error("Cannot Encode At This Version");
        return version;
    }
    let result = -1;
    for (let i = 1; i <= 40; i++) {
        const length: number = computeNumCodewords(segments, i);
        for (const key in constants.ECL) {
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

function generateOptimalSegments(points: Array<CodePoint>, version: Version, ecl: Ecl, forced: boolean): [Version, Array<Segment>] {
    if (forced) {
        const modes: Array<Mode> = computeOptimalEncodingMode(points, version),
            segments: Array<Segment> = generateSegmentsFromMultiModes(points, modes);
        return [computeOptimalVersion(segments, version, ecl, forced), segments];
    }
    const versions: Array<Version> = [1, 10, 27, 40];
    if (versions.indexOf(version) == -1) {
        versions.push(version);
        versions.sort((a, b) => a - b);
    }
    const index: number = versions.indexOf(version);
    versions.splice(0, index);
    for (let i = 0; i < versions.length - 1; i++) {
        const modes: Array<Mode> = computeOptimalEncodingMode(points, versions[i]),
            segments: Array<Segment> = generateSegmentsFromMultiModes(points, modes),
            ver = computeOptimalVersion(segments, versions[i], ecl, forced);
        if (versions[i] <= ver && ver <= versions[i+1]) return [ver, segments];
    }
    const modes: Array<Mode> = computeOptimalEncodingMode(points, versions[versions.length - 1]),
        segments: Array<Segment> = generateSegmentsFromMultiModes(points, modes);
    return [computeOptimalVersion(segments, versions[versions.length - 1], ecl, forced), segments];
}

// Step 4
function generateDataCodeword(segments: Array<Segment>, version: Version, ecl: Ecl): Array<DataCodeword> {
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
    for (let i = 0, n = (capacity - bits.length) / 8; i < n; i++) {
        if (i % 2 == 0) pad.push(1, 1, 1, 0, 1, 1, 0, 0);
        else pad.push(0, 0, 0, 1, 0, 0, 0, 1);
    }
    pad.forEach(bit => bits.push(bit));

    for (let i = 0; i < bits.length; i += 8) {
        const codeword: DataCodeword = new DataCodeword(parseInt(bits.slice(i, i + 8).join(""), 2));
        codeword.setPreEcIndex(i / 8);
        result.push(codeword);
    }
    return result;
}

function splitData(data: Array<DataCodeword>, version: Version, ecl: Ecl): Array<Array<DataCodeword>> {
    const num_blocks: number = getNumEcBlocks(version, ecl),
        num_ec: number = getNumEcCodeword(version, ecl),
        num_codewords: number = computeNumRawCodeword(version),
        num_short_block: number = num_blocks - num_codewords % num_blocks,
        short_block_length: number = Math.floor(num_codewords / num_blocks),
        result: Array<Array<DataCodeword>> = [];

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

function generateEcCodeword(blocks: Array<Array<DataCodeword>>, version: Version, ecl: Ecl): Array<Array<EcCodeword>> {
    const num_ec: number = getNumEcCodeword(version, ecl),
        short_block_length: number = blocks[0].length,
        ec: RSECG = new RSECG(num_ec);
    let pre_inter_leave_index = 0;

    return blocks.map((block, index) => {
        for (const dataCodeword of block) {
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
        });
    });
}

function interleaveBlocks(data_blocks: Array<Array<DataCodeword>>, ec_blocks: Array<Array<EcCodeword>>): Array<Codeword> {
    const ec_block_length: number = ec_blocks[0].length,
        data_block_length: number = data_blocks[data_blocks.length - 1].length,
        result: Array<Codeword> = [];
    for (let i = 0; i < data_block_length; i++) {
        data_blocks.forEach(block => {
            if (i < block.length) {
                const codeword: Codeword = block[i];
                codeword.setPostInterleaveIndex(result.length);
                result.push(codeword);
            }
        });
    }
    for (let i = 0; i < ec_block_length; i++) {
        ec_blocks.forEach(block => {
            const codeword: Codeword = block[i];
            codeword.setPostInterleaveIndex(result.length);
            result.push(codeword);
        });
    }
    return result;
}

// Step 5
function generateCodeword(data: Array<DataCodeword>, version: Version, ecl: Ecl): Array<Codeword> {
    const data_blocks: Array<Array<DataCodeword>> = splitData(data, version, ecl),
        ec_blocks: Array<Array<EcCodeword>> = generateEcCodeword(data_blocks, version, ecl);
    return interleaveBlocks(data_blocks, ec_blocks);
}

// Step 6
function generateRawQR(data: Array<Codeword>, version: Version, ecl: Ecl): QR {
    const qr: QR = new QR(version, ecl);
    qr.initialize();
    const path: Array<Position> = qr.generateDataPath();
    qr.placeCodeword(data, path);
    return qr;
}

// Step 7
function computeOptimalMask(qr: QR): [number, QR] {
    const masks: Array<QR> = qr.generateAllMasks(),
        values: Array<number> = masks.map((mask, index) => {
            const copy = qr.copy();
            copy.applyMask(mask);
            copy.drawFormatPatterns(index);
            return copy.computePenalty();
        }),
        which: number = values.indexOf(Math.min(...values));
    return [which, masks[which]];
}

// Step 8
function generateQR(qr: QR, mask: [number, QR]): void {
    qr.applyMask(mask[1]);
    qr.drawFormatPatterns(mask[0]);
}

export {
    isAlphanumeric,
    isNumeric,
    generateCodePoint,
    generateSegmentFromSingleMode,
    generateSegmentsFromMultiModes,
    computeOptimalEncodingMode,
    computeOptimalVersion,
    generateOptimalSegments,
    generateDataCodeword,
    generateCodeword,
    generateRawQR,
    computeOptimalMask,
    generateQR
};