/**
 * @packageDocumentation
 * @module utils
 */

import {Mode} from "./types";

/**
 * The class for containing encoded string data
 */
export default class Segment {

    /** The encoding mode */
    private readonly mode: Mode;
    /** The number of characters */
    private readonly char_len: number;
    /** The binary data */
    private readonly data: Array<number>;

    /**
     * Create a new Segment object
     *
     * @param mode  The encoding mode
     * @param len  The number of characters
     * @param bits  The binary data
     */
    public constructor(mode: Mode, len: number, bits: Array<number>) {
        this.mode = mode;
        this.char_len = len;
        this.data = bits;
    }

    /** Return the encoding mode*/
    public getMode(): Mode {return this.mode;}

    /** Return the number of characters */
    public getCharLen(): number {return this.char_len;}

    /** Return the binary data*/
    public getData(): Array<number> {return this.data;}
}
