export default class CodePoint {

    private readonly utf16_char: string;
    private readonly utf8_code: Array<number>;

    constructor(char: string) {
        this.utf16_char = char;
        this.utf8_code = CodePoint.toUTF8Array(char);
    }

    // source: https://gist.github.com/joni/3760795#file-toutf8array-js
    public static toUTF8Array(str: string): Array<number> {
        const result: Array<number> = [];
        for (let i = 0; i < str.length; i++) {
            let char_code: number = str.charCodeAt(i);
            if (char_code < 0x80) result.push(char_code);
            else if (char_code < 0x800) {
                result.push(0xc0 | (char_code >> 6),
                    0x80 | (char_code & 0x3f));
            }
            else if (char_code < 0xd800 || char_code >= 0xe000) {
                result.push(0xe0 | (char_code >> 12),
                    0x80 | ((char_code >> 6) & 0x3f),
                    0x80 | (char_code & 0x3f));
            }
            // surrogate pair
            else {
                char_code = ((char_code & 0x3ff) << 10)|(str.charCodeAt(++i) & 0x3ff) + 0x010000;
                result.push(0xf0 | (char_code >> 18),
                    0x80 | ((char_code >> 12) & 0x3f),
                    0x80 | ((char_code >> 6) & 0x3f),
                    0x80 | (char_code & 0x3f));
            }
        }
        return result;
    }

    public getChar(): string {return this.utf16_char;}
    public getCode(): Array<number> {return this.utf8_code;}
}
