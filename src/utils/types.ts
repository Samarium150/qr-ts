/**
 * @module utils
 */

import { Literal, Number, Static, Tuple, Union } from "runtypes";

/**
 * A Union of data encoding mode in string literal
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Mode = Union(
    Literal("BYTE"),
    Literal("NUMERIC"),
    Literal("ALPHANUMERIC"),
    Literal("KANJI")
);

type Mode = Static<typeof Mode>;

/**
 * A Union of error correction level in string literal
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Ecl = Union(
    Literal("LOW"),
    Literal("MEDIUM"),
    Literal("QUARTILE"),
    Literal("HIGH")
);
type Ecl = Static<typeof Ecl>;

/**
 * A union of functionalities in string literal
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Functional = Union(
    Literal("FINDER"),
    Literal("SEPARATOR"),
    Literal("TIMING"),
    Literal("ALIGNMENT"),
    Literal("FORMAT_INFO"),
    Literal("VERSION_INFO"),
    Literal("Dark")
);
type Functional =  Static<typeof Functional>;

/**
 * A 2D position represented by a tuple of integer
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Position = Tuple(Number, Number);
type Position = Static<typeof Position>;

/**
 * A number between 1 and 40 (including)
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Version = Number.withConstraint(n => 1 <= n && n <= 40 || `${n} is not a valid version number`);
type Version = Static<typeof Version>;

/**
 * A number between -1 and 7 (including)
 * for type aliasing.
 * External library {@link https://github.com/pelotom/runtypes | runtypes} used here.
 */
const Mask = Number.withConstraint(n => -1 <= n && n <= 7 || `${n} is not a valid mask choice`);
type Mask = Static<typeof Mask>;

interface GeneratorOptions {
    /** The **minimal** version of QR code, default is 1 */
    version?: Version,
    /** The error correction level of QR code, default is "LOW" */
    ecl?: Ecl,
    /** The choice of forcing to use the minimal version, default is false */
    forced?: boolean,
    /** The choice of mask patterns, default is -1 */
    mask?: Mask
}

interface RenderOptions {
    /**
     * The color choice of dark module/pixels,
     * suppose to be a valid hex color number string,
     * default is #000000 - stands for black
     */
    c1?: string,
    /**
     * The color choice of light module/pixels,
     * suppose to be a valid hex color number string,
     * default is #FFFFFF - stands for white
     */
    c2?: string,
    /** The size/width of a module/square, default is 10 */
    size?: number
}

export type {
    Mode,
    Functional,
    Position,
    GeneratorOptions,
    RenderOptions
};

export {
    Version,
    Ecl,
    Mask
};
