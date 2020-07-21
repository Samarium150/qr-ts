import * as constants from "./constants";
import Segment from "./Segment";


export namespace utils {

    export type Mode = "BYTE" | "NUMERIC" | "ALPHANUMERIC" | "KANJI";

    export type Ecl = "LOW" | "MEDIUM" | "QUARTILE" | "HIGH";

    export function computeModeCharCount(mode: Mode, version: number): number {
        return (0 < version && version <= 40) ? constants.MODE[mode].charCount[Math.floor((version + 7) / 17)] : -1;
    }
    
    export function isAlphanumeric(code: number): boolean {
        return code < 128 && constants.ALPHANUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }

    export function isNumeric(code: number): boolean {
        return code < 128 && constants.NUMERIC.indexOf(String.fromCodePoint(code)) != -1;
    }

    function computeNumRawDataModule(version: number): number {
        let result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            const align: number = Math.floor(version / 7) + 2;
            result -= (25 * align - 10) * align - 55
            if (version >= 7) result -= 36;
        }
        return result;
    }
    
    function getCapacity(version: number, ecl: Ecl): number {
        return constants.CAPACITY[version][constants.ECL[ecl].ordinal];
    }

    export function computeOptimalVersion(segments: Array<Segment>, version: number, ecl: Ecl): number {
        let result: number = -1;
        for (let i = 1; i <= 40; i++) {
            const len = Segment.computeNumCodewords(segments, i);
            for (let key in constants.ECL) {
                if (key == ecl) {
                    const capacity = getCapacity(i, ecl);
                    if (len <= capacity && result == -1 && i >= version) {
                        result = i;
                        break;
                    }
                }
            }
        }
        return result;
    }

}