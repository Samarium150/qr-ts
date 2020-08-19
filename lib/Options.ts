/**
 * @packageDocumentation
 * @module utils
 */

import {Ecl, Mask, Version} from "./types";

/**
 *  The interface for wrapping choices of generating QR code
 */
export default interface Options {
    /** The **minimal** version of QR code, default is 1 */
    version?: Version,
    /** The error correction level of QR code, default is "LOW" */
    ecl?: Ecl,
    /** The choice of forcing to use the minimal version, default is false */
    forced?: boolean,
    /** The choice of mask patterns, default is -1 */
    mask?: Mask
    /**
     * The color choice of dark module/pixels, \
     * suppose to be a valid hex color number string, \
     * default is #000000 - stands for black
     */
    c1?: string,
    /**
     * The color choice of light module/pixels, \
     * suppose to be a valid hex color number string, \
     * default is #FFFFFF - stands for white
     */
    c2?: string,
    /** The size/width of a module/square, default is 10 */
    size?: number
}