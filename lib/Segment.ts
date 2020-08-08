import {Mode} from "./types";

export default class Segment {

    private readonly mode: Mode;
    private readonly char_len: number;
    private readonly data: Array<number>;

    public constructor(mode: Mode, len: number, bits: Array<number>) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }

    public getMode(): Mode {return this.mode;}
    public getCharLen(): number {return this.char_len;}
    public getData(): Array<number> {return this.data;}
}
