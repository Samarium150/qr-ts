import {Literal, Number, Static, Tuple, Union} from "runtypes";

const Mode = Union(
    Literal("BYTE"),
    Literal("NUMERIC"),
    Literal("ALPHANUMERIC"),
    Literal("KANJI")
);
type Mode = Static<typeof Mode>;

const Ecl = Union(
    Literal("LOW"),
    Literal("MEDIUM"),
    Literal("QUARTILE"),
    Literal("HIGH")
);
type Ecl = Static<typeof Ecl>;

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

const Position = Tuple(Number, Number);
type Position = Static<typeof Position>;

const Version = Number.withConstraint(n => 1 <= n && n <= 40);
type Version = Static<typeof Version>;

const Mask = Number.withConstraint(n => -1 <= n && n <= 7);
type Mask = Static<typeof Mask>;

export {
    Mode,
    Ecl,
    Functional,
    Position,
    Version,
    Mask
};
