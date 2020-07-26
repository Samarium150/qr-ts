import * as types from "./types";

export default class Segment {

    private readonly mode: types.Mode;
    private readonly char_len: number;
    private readonly data: Array<number>;

    public constructor(mode: types.Mode, len: number, bits: Array<number>) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }

    public getMode(): types.Mode {return this.mode;}
    public getCharLen(): number {return this.char_len;}
    public getData(): Array<number> {return this.data;}
}
