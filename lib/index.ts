/**
 *
 */
import {utils} from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment"

export namespace app {

    export function debug(str: string) {
        console.log(`DEBUG: ${str}`);
    }
    export function getCodePoints(str: string) {
        return CodePoint.generate(str);
    }
    export function getSegments(points: Array<CodePoint>, mode: utils.Mode) {
        return Segment.generateFromSingleMode(points, mode);
    }

    export function computeVersion(segments: Array<Segment>, version: number, ecl: utils.Ecl) {
        return utils.computeOptimalVersion(segments, version, ecl);
    }

}
