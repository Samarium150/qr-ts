/**
 *
 */
import * as types from "./types"
import {utils} from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment"
import {Codeword, DataCodeword} from "./Codeword"
import QR from "./QR";
import {Module} from "./Module";

export namespace app {

    export function debug(str: string) {
        console.log(`DEBUG: ${str}`);
    }

    export function generate(text: string, version: number, ecl: types.Ecl, forced: boolean, mask: number) {
        if (!(typeof text == "string") || text.length === 0) throw Error("Invalid Input");
        if (version < 1 || version > 40) throw Error("Invalid Version");
        // TODO: type checking for ecl
        if (!(typeof forced == "boolean")) throw Error("Invalid Forced Value");
        if (mask < -1 || mask > 7) throw Error("Invalid Mask");

        const codePoints: Array<CodePoint> = utils.generateCodePoint(text);
        let isNumeric: boolean = true, isAlphanumeric: boolean = true;
        codePoints.forEach(codePoint => {
            isNumeric = isNumeric && utils.isNumeric(codePoint.getChar());
            isAlphanumeric = isAlphanumeric && utils.isAlphanumeric(codePoint.getChar());
        });
        const mode: types.Mode = (isNumeric) ? "NUMERIC" : (isAlphanumeric) ? "ALPHANUMERIC" : "BYTE",
            segments: Array<Segment> = [utils.generateSegmentFromSingleMode(codePoints, mode)],
            optimalVersion: number = utils.computeOptimalVersion(segments, version, ecl, forced),
            dataCodeword: Array<DataCodeword> = utils.generateDataCodeword(segments, optimalVersion, ecl),
            codeword: Array<Codeword> = utils.generateCodeword(dataCodeword, optimalVersion, ecl),
            code: QR = utils.generateRawQR(codeword, optimalVersion, ecl),
            optimalMask: [number, QR] = (mask == -1) ? utils.computeOptimalMask(code) : [mask, code.generateMask(mask)];
        utils.generateQR(code, optimalMask);
        code.extend(); // Changeable
        const output: HTMLCanvasElement = document.createElement("canvas"),
            context: CanvasRenderingContext2D = output.getContext("2d")!,
            numBlock: number = code.getSize() + 8,
            size: number = 10; // Changeable
        output.id = "output";
        output.width = numBlock * size;
        output.height = numBlock * size;
        const modules: Array<Array<Module>> = code.getModules();
        for (let row: number = 0; row < numBlock; row++) {
            for (let col: number = 0; col < numBlock; col++) {
                context.fillStyle = (modules[row][col].getColor()) ? "#000000" : "#FFFFFF"; // Changeable
                context.fillRect(col * size, row * size, size, size);
            }
        }
        context.stroke();
        return output;
    }
}
