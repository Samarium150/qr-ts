/**
 *
 */
import {Version, Ecl, Mask} from "./types";
import * as utils from "./utils";
import CodePoint from "./CodePoint";
import Segment from "./Segment";
import {Codeword} from "./Codeword";
import QR from "./QR";
import {Module} from "./Module";


function debug(message?: unknown, ...optionalParams: unknown[]): void {
    console.log("QR DEBUG:", message, ...optionalParams);
}

function _generate(text: string, version: Version, ecl: Ecl, forced: boolean, mask: Mask): HTMLCanvasElement {
    const codePoints: Array<CodePoint> = utils.generateCodePoint(text),
        [optimalVersion, segments]: [Version, Array<Segment>] = utils.generateOptimalSegments(codePoints, version, ecl, forced),
        codeword: Array<Codeword> = utils.generateCodeword(utils.generateDataCodeword(segments, optimalVersion, ecl), optimalVersion, ecl),
        code: QR = utils.generateRawQR(codeword, optimalVersion, ecl),
        optimalMask: [number, QR] = (mask == -1) ? utils.computeOptimalMask(code) : [mask, code.generateMask(mask)];
    utils.generateQR(code, optimalMask);
    code.extend();
    const output: HTMLCanvasElement = document.createElement("canvas"),
        context: CanvasRenderingContext2D | null = output.getContext("2d"),
        numBlock: number = code.getSize() + 8,
        size = 10; // Changeable
    if (!context) throw Error("Cannot get canvas context");
    output.id = "output";
    output.width = numBlock * size;
    output.height = numBlock * size;
    const modules: Array<Array<Module>> = code.getModules();
    for (let row = 0; row < numBlock; row++) {
        for (let col = 0; col < numBlock; col++) {
            context.fillStyle = (modules[row][col].getColor()) ? "#000000" : "#FFFFFF"; // Changeable
            context.fillRect(col * size, row * size, size, size);
        }
    }
    context.stroke();
    return output;
}

function generate(text: unknown, version: unknown, ecl: unknown, forced: unknown, mask: unknown): HTMLCanvasElement {
    if (typeof text !== "string" || text.length === 0) throw Error("Invalid Input String");
    if (!Version.guard(version)) throw Error("Invalid Version");
    if (!Ecl.guard(ecl)) throw Error("Invalid Error Correction Level");
    if (typeof forced !== "boolean") throw Error("Invalid Forced Value");
    if (!Mask.guard(mask)) throw Error("Invalid Mask Choice");
    return _generate(text, version, ecl, forced, mask);
}

function test(): void {
    // const text = "茗荷"//"👩‍❤️‍💋‍👩";
    // const codePoints: Array<CodePoint> = utils.generateCodePoint(text);
    // let isNumeric = true, isAlphanumeric = true;
    // codePoints.forEach(codePoint => {
    //     isNumeric = isNumeric && utils.isNumeric(codePoint.getChar());
    //     isAlphanumeric = isAlphanumeric && utils.isAlphanumeric(codePoint.getChar());
    // });
    // const mode: Mode = (isNumeric) ? "NUMERIC" : (isAlphanumeric) ? "ALPHANUMERIC" : "BYTE",
    //     segments: Array<Segment> = [utils.generateSegmentFromSingleMode(codePoints, mode)],
    //     optimalVersion: number = utils.computeOptimalVersion(segments, 1, "LOW", false),
    //     dataCodeword: Array<DataCodeword> = utils.generateDataCodeword(segments, optimalVersion, "LOW"),
    //     codeword: Array<Codeword> = utils.generateCodeword(dataCodeword, optimalVersion, "LOW"),
    //     code: QR = utils.generateRawQR(codeword, optimalVersion, "LOW"),
    //     optimalMask: [number, QR] = utils.computeOptimalMask(code);
    // utils.generateQR(code, optimalMask);
    // code.extend(); // Changeable
}

export {
    debug,
    generate,
    test
};