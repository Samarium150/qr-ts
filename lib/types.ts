type Mode = "BYTE" | "NUMERIC" | "ALPHANUMERIC" | "KANJI";
type Ecl = "LOW" | "MEDIUM" | "QUARTILE" | "HIGH";
type Function = "FINDER" | "SEPARATOR" | "TIMING" | "ALIGNMENT" | "FORMAT_INFO" | "VERSION_INFO" | "Dark";
type Position = [number, number];

export {
    Mode,
    Ecl,
    Function,
    Position
};