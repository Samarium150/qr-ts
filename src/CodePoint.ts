/**
 * @packageDocumentation
 * @module utils
 */

/**
 * The class for containing the UTF-16 character
 * and corresponding UTF-8 codepoints array of input string
 */
export default class CodePoint {

    /** A character of the input string */
    private readonly utf16_char: string;
    /** The UTF-8 codepoints array corresponding to the UTF-16 character */
    private readonly utf8_code: Array<number>;

    /**
     * Create a new CodePoint instance
     * @param char  A character of the input string
     */
    constructor(char: string) {
        this.utf16_char = char;
        this.utf8_code = CodePoint.toUTF8Array(char);
    }

    /**
     * Convert the given *\<str\>* to a UTF-8 codepoints array. \
     * Source code {@link https://gist.github.com/joni/3760795#file-toutf8array-js | HERE}
     *
     * @param str  The input string
     */
    public static toUTF8Array(str: string): Array<number> {
        const result: Array<number> = [];
        for (let i = 0; i < str.length; i++) {
            let char_code: number = str.charCodeAt(i);
            if (char_code < 0x80) result.push(char_code);
            else if (char_code < 0x800) {
                result.push(0xc0 | (char_code >> 6),
                    0x80 | (char_code & 0x3f));
            } else if (char_code < 0xd800 || char_code >= 0xe000) {
                result.push(0xe0 | (char_code >> 12),
                    0x80 | ((char_code >> 6) & 0x3f),
                    0x80 | (char_code & 0x3f));
            } else {
                char_code = ((char_code & 0x3ff) << 10)|(str.charCodeAt(++i) & 0x3ff) + 0x010000;
                result.push(0xf0 | (char_code >> 18),
                    0x80 | ((char_code >> 12) & 0x3f),
                    0x80 | ((char_code >> 6) & 0x3f),
                    0x80 | (char_code & 0x3f));
            }
        }
        return result;
    }

    /** Return the UTF-16 character */
    public getChar(): string {return this.utf16_char;}

    /** Return the UTF-8 codepoints array */
    public getCode(): Array<number> {return this.utf8_code;}
}
