/**
 *
 */
import * as types from "./types"
import {utils} from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment"
import {DataCodeword} from "./Codeword"

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

    export function getDataCodeword(segments: Array<Segment>, version: number) {
        return utils.generateDataCodeword(segments, version);
    }
    
    export function getCodeword(data: Array<DataCodeword>, version: number, ecl: types.Ecl) {
        return utils.generateCodeword(data, version, ecl);
    }

}
