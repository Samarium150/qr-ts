import {utils} from "./utils";
import CodePoint from "./CodePoint";
import * as constants from "./constants"

export default class Segment {
    public readonly mode: utils.Mode;
    public readonly char_len: number;
    public readonly data: Array<number>;

    public constructor(mode: utils.Mode, len: number, bits: Array<number>) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }

    public static computeBitsLength(segments: Array<Segment>, version: number): number {
        let result: number = 0;
        for (const segment of segments) {
            const modeCharCountBits: number = utils.computeModeCharCount(segment.mode, version);
            if (segment.char_len >= (1 << modeCharCountBits)) return Infinity;
            result += modeCharCountBits + segment.data.length + 4;
        }
        return result;
    }

    public static computeNumCodewords(segments: Array<Segment>, version: number): number {
        return Math.ceil(Segment.computeBitsLength(segments, version) / 8);
    }

    public static generateFromSingleMode(points: Array<CodePoint>, mode: utils.Mode): Segment {
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

    public static generateFromMultiModes(points: Array<CodePoint>, modes: Array<utils.Mode>): Array<Segment> {
        const result: Array<Segment> = [];
        return result;
    }
}

