/**
 * @packageDocumentation
 * @module utils
 */

import {Literal, Number, Static, Tuple, Union} from "runtypes";

/**
 * A Union of data encoding mode in string literal
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
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
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
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
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
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
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
 */
const Position = Tuple(Number, Number);
type Position = Static<typeof Position>;

/**
 * A number between 1 and 40 (including)
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
 */
const Version = Number.withConstraint(n => 1 <= n && n <= 40 || `${n} is not a valid version number`);
type Version = Static<typeof Version>;

/**
 * A number between -1 and 7 (including)
 * for type aliasing. \
 * External library {@link https://github.com/pelotom/runtypes | runtypes } used here.
 *
 * @category Constant
 */
const Mask = Number.withConstraint(n => -1 <= n && n <= 7 || `${n} is not a valid mask choice`);
type Mask = Static<typeof Mask>;

export {
    Mode,
    Ecl,
    Functional,
    Position,
    Version,
    Mask
};
