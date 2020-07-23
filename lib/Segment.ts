import * as types from "./types";

export default class Segment {
    public readonly mode: types.Mode;
    public readonly char_len: number;
    public readonly data: Array<number>;

    public constructor(mode: types.Mode, len: number, bits: Array<number>) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }
}
