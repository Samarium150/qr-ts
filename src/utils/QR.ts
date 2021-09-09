/**
 * @module utils
 */
import { Version, Ecl, Position, Mask } from "./types";
import { ALIGNMENT_POSITION, VERSION_INFO, PENALTIES, FORMAT_INFO, ECL } from "./constants";
import { DataModule, FunctionalModule, MaskModule, Module, QuietModule } from "./Module";
import { Codeword } from "./Codeword";

/**
 * The class for containing all information to generate a QR code
 */
export default class QR {

    /** The version of QR code*/
    private readonly version: Version;
    /** The error correction level */
    private readonly ecl: Ecl;
    /** The size of QR code according to the version */
    private readonly size: number;
    /** All data represented by a 2D array of module objects */
    private modules: Array<Array<Module>> = [];

    /**
     * Create a new QR instance
     *
     * @param version - The version of QR code
     * @param ecl - The error correction level
     * @param modules - The initial data for copying
     */
    constructor(version: Version, ecl: Ecl, modules?: Array<Array<Module>>) {
        this.version = version;
        this.ecl = ecl;
        this.size = version * 4 + 17;
        if (modules) this.modules = modules.map(row => row.map(module => module.copy()));
        else {
            for (let i = 0; i < this.size; i++) {
                const row: Array<Module> = [];
                for (let j = 0; j < this.size; j++) row.push(new Module());
                this.modules.push(row);
            }
        }
    }

    /**
     * Get the specific bit of the given *\<bits\>* at *\<index\>*
     * from right to left
     *
     * @param bits
     * @param index
     * @private
     */
    private static getBitAt(bits: number, index: number): number {
        return (bits >>> index) & 1;
    }

    /** Return the size */
    public getSize(): number {return this.size;}
    /** Return the data */
    public getModules(): Array<Array<Module>> {return this.modules;}

    /** Deep copy itself */
    public copy(): QR {
        return new QR(this.version, this.ecl, this.modules);
    }

    /** Stringify the data */
    public toString(): string {
        return this.modules.map(row => row.map(module => module.getColor() ? 1 : 0).join(" ")).join("\n");
    }

    /** Initializing by drawing fixed patterns */
    public initialize(): void {
        this.drawTimingPatterns();
        this.drawFinderPatterns();
        this.drawSeparatorPatterns();
        this.drawAlignmentPatterns();
        this.drawDarkPattern();
        this.drawFormatPatterns();
        this.drawVersionInfoPatterns();
    }

    /** Draw the timing patterns */
    private drawTimingPatterns(): void {
        for (let i = 0; i < this.size; i++) {
            const color: boolean = i % 2 == 0;
            this.modules[6][i] = new FunctionalModule("TIMING", color);
            this.modules[i][6] = new FunctionalModule("TIMING", color);
        }
    }

    /** Draw the finder patterns */
    private drawFinderPatterns(): void {
        const pos: Array<Position> = [ [ 0, 0 ], [ this.size - 7, 0 ], [ 0, this.size - 7 ] ];
        for (const [ x, y ] of pos) {
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

    /** Draw the separator patterns */
    private drawSeparatorPatterns(): void {
        const pos1: Array<Position> = [ [ 7, 0 ], [ 7, this.size - 8 ], [ this.size - 8, 0 ] ],
            pos2: Array<Position> = [ [ 0, 7 ], [ 0, this.size - 8 ], [ this.size - 8, 7 ] ];
        for (const [ x, y ] of pos1) {
            for (let i = 0; i < 8; i++) this.modules[x][y + i] = new FunctionalModule("SEPARATOR", false);
        }
        for (const [ x, y ] of pos2) {
            for (let i = 0; i < 8; i++) this.modules[x + i][y] = new FunctionalModule("SEPARATOR", false);
        }
    }

    /** Draw the alignment patterns */
    private drawAlignmentPatterns(): void {
        if (this.version == 1) return;
        const p: Array<number> = ALIGNMENT_POSITION[this.version];
        // combine row and column position
        for (const x of p) {
            for (const y of p) {
                const module: Module = this.modules[x][y];
                if (module instanceof FunctionalModule && (module as FunctionalModule).getType() != "TIMING") continue;
                const pos: Position = [ x - 2, y - 2 ];
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        const px: number = pos[0] + i, py: number = pos[1] + j;
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

    /** Draw the dark pattern */
    private drawDarkPattern(): void {
        this.modules[this.version * 4 + 9][8] = new FunctionalModule("Dark", true);
    }

    /** Draw the format patterns */
    public drawFormatPatterns(mask?: Mask): void {
        const bits: number = (mask != undefined)? FORMAT_INFO[ECL[this.ecl]][mask] : 0;
        for (let i = 0; i < 8; i++) {
            const color: boolean = QR.getBitAt(bits, i) != 0;
            this.modules[8][this.size - i - 1] = new FunctionalModule("FORMAT_INFO", color);
            this.modules[(i < 6) ? i : i + 1][8] = new FunctionalModule("FORMAT_INFO", color);
        }
        for (let i = 0; i < 7; i++) {
            const color: boolean = QR.getBitAt(bits, i + 8) != 0;
            this.modules[8][(i >= 1) ? 6 - i : 7 - i] = new FunctionalModule("FORMAT_INFO", color);
            this.modules[this.size + i - 7][8] = new FunctionalModule("FORMAT_INFO", color);
        }
    }

    /** Draw the version information patterns */
    private drawVersionInfoPatterns(): void {
        if (this.version < 7) return;
        const bits: number = VERSION_INFO[this.version - 7];
        for (let i = 0; i < 18; i++) {
            const x: number = Math.floor(i / 3),
                y: number = this.size - 11 + i % 3,
                color: boolean = QR.getBitAt(bits, i) != 0;
            this.modules[x][y] = new FunctionalModule("VERSION_INFO", color);
            this.modules[y][x] = new FunctionalModule("VERSION_INFO", color);
        }
    }

    /** Generate an array of positions for placing data */
    public generateDataPath(): Array<Position> {
        const result: Array<Position> = [];
        for (let col = this.size - 1; col > 0; col -= 2) {
            if (col == 6) col = 5; // Skip the vertical Timing Pattern
            for (let row = 0; row < this.size; row++) {
                for (let i = 0; i < 2; i++) {
                    const upward: boolean = ((col + 1) & 2) == 0;
                    const x: number = upward ? this.size - row - 1 : row;
                    const y: number = col - i;
                    if (this.modules[x][y] instanceof FunctionalModule) continue;
                    result.push([ x, y ]);
                }
            }
        }
        return result;
    }

    /**
     * Place the given *\<data\>* into the class through *\<path\>*
     *
     * @param data  The array of codeword
     * @param path  The array of position
     */
    public placeCodeword(data: Array<Codeword>, path: Array<Position>): void {
        path.forEach(([ x, y ], index) => {
            const module: Module = new DataModule();
            if (index < data.length * 8) {
                const codeword: Codeword = data[index >>> 3];
                module.setColor(QR.getBitAt(codeword.getValue(), 7 - (index & 7)) != 0);
                index++;
            } else module.setColor(false);
            this.modules[x][y] = module;
        });
    }

    /**
     * Generate a mask specified by the given *\<which\>*
     *
     * @param which
     */
    public generateMask(which: Mask): QR {
        const result: QR = new QR(this.version, this.ecl);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                let color: boolean;
                switch (which) {
                    case 0: color = (row + col) % 2 == 0; break;
                    case 1: color = row % 2 == 0; break;
                    case 2: color = col % 3 == 0; break;
                    case 3: color = (row + col) % 3 == 0; break;
                    case 4: color = (Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0; break;
                    case 5: color = (row * col) % 2 + (row * col) % 3 == 0; break;
                    case 6: color = ((row * col) % 2 + (row * col) % 3) % 2 == 0; break;
                    case 7: color = ((row + col) % 2 + (row * col) % 3) % 2 == 0; break;
                    default: throw Error("Mask Value Error");
                }
                if ((this.modules[row][col] instanceof FunctionalModule)) continue;
                result.modules[row][col] = new MaskModule(color);
            }
        }
        return result;
    }

    /** Generate all kinds of masks */
    public generateAllMasks(): Array<QR> {
        const result: Array<QR> = [];
        for (let i = 0; i < 8; i++) result.push(this.generateMask(i));
        return result;
    }

    /**
     * Apply the given *\<mask\>* to the data in the class
     *
     * @param mask  The QR object
     */
    public applyMask(mask: QR): void {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const m: Module = mask.modules[row][col];
                const original: Module = this.modules[row][col];
                if (original instanceof DataModule && m instanceof MaskModule)
                    original.setColor(original.getColor() != m.getColor());
            }
        }
    }

    /** Compute the penalty for the class */
    public computePenalty(): number {
        let dark = 0, p1 = 0, p2 = 0, p3 = 0;
        const sim1: Array<boolean> = [ true, false, true, true, true, false, true, false, false, false, false ],
            sim2: Array<boolean> = [ false, false, false, false, true, false, true, true, true, false, true ],
            r1 = (result: boolean, curr: boolean, index: number) => result && (curr == sim1[index]),
            r2 = (result: boolean, curr: boolean, index: number) => result && (curr == sim2[index]);
        for (let i = 0; i < this.size; i++) {
            // Step 1: penalties for each group of 5 or more same-colored module
            let row_flag = true, col_flag = true,
                row_counter = 0, col_counter = 0;
            const row_queue: Array<boolean> = [], col_queue: Array<boolean> = [];
            for (let j = 0; j < this.size; j++) {
                // scan each row
                const row_color: boolean = this.modules[i][j].getColor();
                row_queue.push(row_color);

                // scan each column
                const col_color: boolean = this.modules[j][i].getColor();
                col_queue.push(col_color);

                // count the number of dark modules
                if (row_color) dark++;

                // row scanning switch color
                if (row_color != row_flag){
                    row_flag = row_color;
                    if (row_counter >= 5) p1 += PENALTIES.S1 + row_counter - 5;
                    row_counter = 1;
                } else row_counter++; // stays the same

                // column scanning switch color
                if (col_color != col_flag) {
                    col_flag = col_color;
                    if (col_counter >= 5) p1 += PENALTIES.S1 + col_counter - 5;
                    col_counter = 1;
                } else col_counter++; // stays the same

                // encounter last module for each row/column
                if (j == this.size - 1) {
                    if (row_counter >= 5) p1 += PENALTIES.S1 + row_counter - 5;
                    if (col_counter >= 5) p1 += PENALTIES.S1 + col_counter - 5;
                } else if (i != this.size - 1) {
                    // Step 2: penalties for each 2 * 2 area of same-colored module
                    const x = this.modules[i][j + 1].getColor(),
                        y = this.modules[i + 1][j].getColor(),
                        z = this.modules[i + 1][j + 1].getColor();
                    if (row_color == x && y == z && x == y) p2 += PENALTIES.S2;
                }

                // Step 3: penalties for patterns that look similar to finder patterns
                if (row_queue.length == sim1.length) { // same boolean value for column queue
                    const a: boolean = row_queue.reduce(r1, true),
                        b: boolean = row_queue.reduce(r2, true),
                        c: boolean = col_queue.reduce(r1, true),
                        d: boolean = col_queue.reduce(r2, true);
                    if (a) p3 += PENALTIES.S3;
                    if (b) p3 += PENALTIES.S3;
                    if (c) p3 += PENALTIES.S3;
                    if (d) p3 += PENALTIES.S3;
                    row_queue.splice(0, 1);
                    col_queue.splice(0, 1);
                }
            }
        }

        // Step 4: penalties for unbalanced light-dark ratio
        const ratio: number = parseInt(((dark / this.size ** 2) * 100).toFixed());
        let a = 0, b = 0;
        for (let i = 0; i < 5; i++) {
            const prev: number = ratio - i,
                next: number = ratio + i;
            if(prev % 5 == 0) a = prev;
            if(next % 5 == 0) b = next;
        }
        const p4 = Math.min(Math.abs(a - 50), Math.abs(b - 50)) * PENALTIES.S4;
        return p1 + p2 + p3 + p4;
    }

    /** Add 4 rows of light modules */
    private generateQuietRows(): Array<Array<QuietModule>> {
        const result: Array<Array<QuietModule>> = [];
        for (let i = 0; i < 4; i++) {
            const row: Array<Module> = [];
            for (let j = 0; j < this.size + 8; j++) row.push(new QuietModule());
            result.push(row);
        }
        return result;
    }

    /** Add a quiet zone - a 4-module-wide area of light modules around the QR code */
    public extend(): void {
        const pre: Array<Array<Module>> = this.generateQuietRows();
        for (let i = 0; i < this.size; i++) {
            const row: Array<Module> = [];
            for (let j = -4; j < this.size + 4; j++)
                (j < 0 || j > this.size - 1) ? row.push(new QuietModule()) : row.push(this.modules[i][j]);
            pre.push(row);
        }
        this.modules = pre.concat(this.generateQuietRows());
    }
}
