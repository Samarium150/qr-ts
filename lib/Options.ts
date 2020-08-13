/**
 * @packageDocumentation
 * @module utils
 */

import {Ecl, Mask, Version} from "./types";

/**
 *  The interface for wrapping choices of generating QR code
 */
export default interface Options {
    /** The **minimal** version of QR code */
    version?: Version,
    /** The error correction level of QR code */
    ecl?: Ecl,
    /** The choice of forcing to use the minimal version */
    forced?: boolean,
    /** The choice of mask patterns*/
    mask?: Mask
    /**
     * The color choice of dark module/pixels, \
     * suppose to be a valid hex color number string
     */
    c1?: string,
    /**
     * The color choice of light module/pixels, \
     * suppose to be a valid hex color number string
     */
    c2?: string,
    /** The size/width of a module */
    size?: number
}