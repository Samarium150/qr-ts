/**
 *
 */
import * as types from "./types"
import {utils} from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment"
import {Codeword, DataCodeword} from "./Codeword"
import QR from "./QR";

export namespace app {

    export function debug(str: string) {
        console.log(`DEBUG: ${str}`);
    }

    export function generate(text: string, version: number, ecl: types.Ecl, forced: boolean, mask: number) {
        if (!(typeof text === "string") || text.length === 0) throw Error("Invalid Input");
        if (version < 1 || version > 40) throw Error("Invalid Version");
        // TODO: type checking for ecl
        if (!(typeof forced === "boolean")) throw Error("Invalid Forced Value");
        if (mask < -1 || mask > 7) throw Error("Invalid Mask");

        const codePoints: Array<CodePoint> = utils.generateCodePoint(text);
        let isNumeric: boolean = true, isAlphanumeric: boolean = true;
        codePoints.forEach(codePoint => {
            isNumeric = isNumeric && utils.isNumeric(codePoint.getChar());
            isAlphanumeric = isAlphanumeric && utils.isAlphanumeric(codePoint.getChar());
        });
        const mode: types.Mode = (isNumeric) ? "NUMERIC" : (isAlphanumeric) ? "ALPHANUMERIC" : "BYTE";
        const segments: Array<Segment> = [utils.generateSegmentFromSingleMode(codePoints, mode)];
        const optimalVersion: number = utils.computeOptimalVersion(segments, version, ecl, forced);
        const dataCodeword: Array<DataCodeword> = utils.generateDataCodeword(segments, optimalVersion, ecl);
        const codeword: Array<Codeword> = utils.generateCodeword(dataCodeword, optimalVersion, ecl);
        const code: QR = utils.generateRawQR(codeword, optimalVersion, ecl);
        const optimalMask: [number, QR] = (mask == -1) ? utils.computeOptimalMask(code) : [mask, code.generateMask(mask)];
        utils.generateQR(code, optimalMask);
        return code.toString();
    }
}
