import * as types from "./types";
import * as constants from "./constants";
import {Module, FunctionalModule} from "./Module";
import {Codeword} from "./Codeword";

enum ecls {LOW, MEDIUM, QUARTILE, HIGH}

export default class QR {

    public readonly version: number;
    public readonly ecl: types.Ecl;
    public readonly size: number;
    public readonly modules: Array<Array<Module>> = [];

    constructor(version: number, ecl: types.Ecl) {
        this.version = version;
        this.ecl = ecl;
        this.size = version * 4 + 17;
        for (let i = 0; i < this.size; i++) {
            const row: Array<Module> = [];
            for (let j = 0; j < this.size; j++) row.push(new Module());
            this.modules.push(row);
        }
        this.initialize();
    }

    private static getBitAt(bits: number, index: number, reverse: boolean): number {
        return reverse ? (bits >>> (bits.toString(2).length - index - 1)) & 1 : (bits >>> index) & 1;
    }

    private initialize() {
        this.drawTimingPatterns();
        this.drawFinderPatterns();
        this.drawSeparatorPatterns();
        this.drawAlignmentPatterns();
        this.drawDarkPattern();
        this.drawFormatPatterns();
        this.drawVersionInfoPatterns();
    }

    private drawTimingPatterns() {
        for (let i = 0; i < this.size; i++) {
            const color = i % 2 == 0;
            // row 6
            this.modules[6][i] = new FunctionalModule("TIMING", color);
            // column 6
            this.modules[i][6] = new FunctionalModule("TIMING", color);
        }
    }

    private drawFinderPatterns() {
        const pos: Array<types.Position> = [
            // Top-left, Top-Right, Bottom-left
            [0, 0], [this.size - 7, 0], [0, this.size - 7]
        ];
        for (const [x, y] of pos) {
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 7; j++) {
                    if (i == 0 || i == 6)
                        this.modules[x + i][y + j] = new FunctionalModule("FINDER", true);
                    else if (i == 1 || i == 5)
                        this.modules[x + i][y + j] = new FunctionalModule("FINDER", !(j != 0 && j != 6));
                    else
                        this.modules[x + i][y + j] = new FunctionalModule("FINDER", (j != 1 && j != 5));
                }
            }
        }
    }

    private drawSeparatorPatterns() {
        const pos1: Array<types.Position> = [
            // row placed
            [7, 0], [7, this.size - 8], [this.size - 8, 0]
        ]
        const pos2: Array<types.Position> = [
            // column placed
            [0, 7], [0, this.size - 8], [this.size - 8, 7]
        ]
        for (const [x, y] of pos1) {
            for (let i = 0; i < 8; i++) this.modules[x][y + i] = new FunctionalModule("SEPARATOR", false);
        }
        for (const [x, y] of pos2) {
            for (let i = 0; i < 8; i++) this.modules[x + i][y] = new FunctionalModule("SEPARATOR", false);
        }
    }

    private drawAlignmentPatterns() {
        if (this.version == 1) return;
        const p: Array<number> = constants.ALIGNMENT_POSITION[this.version];
        // combine row and column position
        for (const x of p) {
            for (const y of p) {
                const module = this.modules[x][y];
                if (module instanceof FunctionalModule && (module as FunctionalModule).getType() != "TIMING") continue;
                const pos: types.Position = [x - 2, y - 2];
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        const px = pos[0] + i, py = pos[1] + j;
                        if (i == 0 || i == 4)
                            this.modules[px][py] = new FunctionalModule("ALIGNMENT", true);
                        else if (i == 1 || i == 3)
                            this.modules[px][py] = new FunctionalModule("ALIGNMENT", !(j != 0 && j != 4));
                        else
                            this.modules[px][py] = new FunctionalModule("ALIGNMENT", (j != 1 && j!= 3));
                    }
                }
            }
        }
    }

    private drawDarkPattern() {
        this.modules[this.version * 4 + 9][8] = new FunctionalModule("Dark", true);
    }

    public drawFormatPatterns(mask?: number) {
        const bits: number = (mask != undefined)? constants.FORMAT_INFO[ecls[this.ecl]][mask] : 0;
        // 0 - 6
        for (let i = 0; i < 7; i++) {
            const color = QR.getBitAt(bits, i, true) != 0;
            this.modules[8][(i != 6) ? i : i + 1] = new FunctionalModule("FORMAT_INFO", color);
            this.modules[this.size - i - 1][8] = new FunctionalModule("FORMAT_INFO", color);
        }
        // 7 - 14
        for (let i = 0; i < 8; i++) {
            const color = QR.getBitAt(bits, i + 7, true) != 0;
            this.modules[8][this.size - 8 + i] = new FunctionalModule("FORMAT_INFO", color);
            this.modules[(i < 2) ? 8 - i : 7 - i][8] = new FunctionalModule("FORMAT_INFO", color);
        }
    }

    private drawVersionInfoPatterns() {
        if (this.version < 7) return;
        const bits: number = constants.VERSION_INFO[this.version - 7];
        for (let i = 0; i < 18; i++) {
            const x: number = Math.floor(i / 3);
            const y: number = this.size - 11 + i % 3;
            const color = QR.getBitAt(bits, i, false) != 0;
            this.modules[x][y] = new FunctionalModule("VERSION_INFO", color);
            this.modules[y][x] = new FunctionalModule("VERSION_INFO", color);
        }
    }

    public generateDataPath(): Array<types.Position> {
        const result: Array<types.Position> = [];
        for (let col = this.size - 1; col > 0; col -= 2) {
            if (col == 6) col = 5; // Skip the vertical Timing Pattern
            for (let row = 0; row < this.size; row++) {
                for (let i = 0; i < 2; i++) {
                    const upward: boolean = ((col + 1) & 2) == 0;
                    const x: number = upward ? this.size - row - 1 : row;
                    const y: number = col - i;
                    if (this.modules[x][y] instanceof FunctionalModule) continue;
                    result.push([x, y]);
                }
            }
        }
        return result;
    }

    public placeCodeword(data: Array<Codeword>, path: Array<types.Position>) {
        path.forEach(([x, y], index) => {
            const module: Module = new Module();
            if (index < data.length * 8) {
                const codeword: Codeword = data[index >>> 3];
                module.setColor(QR.getBitAt(codeword.value, 7 - (index & 7), false) != 0);
                index++;
            } else {
                module.setColor(false);
            }
            this.modules[x][y] = module;
        });
    }
}