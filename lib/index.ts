/**
 *
 */
import * as types from "./types"
import {utils} from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment"
import {Codeword, DataCodeword} from "./Codeword"
import QR from "./QR";
import {Module} from "./Module";

export namespace app {

    export function debug(str: string) {
        console.log(`DEBUG: ${str}`);
    }

    export function getCodePoints(str: string) {
        return utils.generateCodePoint(str);
    }

    export function getSegments(points: Array<CodePoint>, mode: types.Mode) {
        return utils.generateSegmentFromSingleMode(points, mode);
    }

    export function computeVersion(segments: Array<Segment>, version: number, ecl: types.Ecl) {
        return utils.computeOptimalVersion(segments, version, ecl);
    }

    export function getDataCodeword(segments: Array<Segment>, version: number, ecl: types.Ecl) {
        return utils.generateDataCodeword(segments, version, ecl);
    }
    
    export function getCodeword(data: Array<DataCodeword>, version: number, ecl: types.Ecl) {
        return utils.generateCodeword(data, version, ecl);
    }

    export function initQR(version: number, ecl: types.Ecl): QR {
        return new QR(version, ecl);
    }

    export function drawQR(qr: QR) {
        console.log(qr.modules.map(row => row.map(module => module.getColor() ? 1 : 0).join("  ")).join("\n"), "\n");
    }

    export function getRawQR(data: Array<Codeword>, version: number, ecl: types.Ecl) {
        return utils.generateRawQR(data, version, ecl);
    }

    export function getMasks(qr: QR) {
        return qr.generateAllMasks();
    }

    export function getOptimalMask(qr: QR) {
        return utils.computeOptimalMask(qr);
    }

}
