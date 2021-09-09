/**
 * This is the entrypoint of qr.js library
 * @module QR
 */

import { Ecl, Mask, Version, GeneratorOptions, RenderOptions } from "./utils/types";
import {
    generateCodePoint,
    generateOptimalSegments,
    generateCodeword,
    generateDataCodeword,
    generateRawQR,
    computeOptimalMask,
    generateQR
} from "./utils";
import QR from "./utils/QR";
import CodePoint from "./utils/CodePoint";
import Segment from "./utils/Segment";
import { Codeword } from "./utils/Codeword";
import { Module, QuietModule } from "./utils/Module";

const defaultGeneratorOptions: GeneratorOptions = {
    version: 1,
    ecl: "LOW",
    forced: false,
    mask: -1,
};

const defaultRenderOptions: RenderOptions = {
    c1: "#000000",
    c2: "#FFFFFF",
    size: 10
};

/**
 * Wrap up all steps for generating the QR code
 *
 * @param text - The string that should be encoded to QR code
 * @param options - Options for how to generate the QR code
 */
function generate(text: string, options: GeneratorOptions = defaultGeneratorOptions): QR {
    const version: Version = options.version as Version,
        ecl: Ecl = options.ecl as Ecl, forced: boolean = options.forced as boolean,
        mask: Mask = options.mask as Mask, codePoints: Array<CodePoint> = generateCodePoint(text),
        [ optimalVersion, segments ]: [Version, Array<Segment>] = generateOptimalSegments(codePoints, version, ecl, forced),
        codeword: Array<Codeword> = generateCodeword(generateDataCodeword(segments, optimalVersion, ecl), optimalVersion, ecl),
        code: QR = generateRawQR(codeword, optimalVersion, ecl),
        optimalMask: [number, QR] = (mask == -1) ? computeOptimalMask(code) : [ mask, code.generateMask(mask) ];
    generateQR(code, optimalMask);
    code.extend();
    return code;
}

/**
 * Render QR code on HTML canvas
 * @param code - the QR code
 * @param id - the id of the canvas element
 * @param options - options for how to render the QR code
 */
function renderOnCanvas(code: QR, id: string, options: RenderOptions = defaultRenderOptions): HTMLCanvasElement {
    const output: HTMLCanvasElement = document.createElement("canvas"),
        context: CanvasRenderingContext2D | null = output.getContext("2d"),
        numBlock: number = code.getSize() + 8,
        size: number = options.size as number;
    if (!context) throw Error("Cannot get canvas context");
    output.id = id;
    output.width = numBlock * size;
    output.height = numBlock * size;
    const modules: Array<Array<Module>> = code.getModules();
    for (let row = 0; row < numBlock; row++) {
        for (let col = 0; col < numBlock; col++) {
            const module: Module = modules[row][col];
            context.fillStyle = (module instanceof QuietModule) ?
                "#FFFFFF" : (module.getColor()) ? options.c1 as string : options.c2 as string;
            context.fillRect(col * size, row * size, size, size);
        }
    }
    context.stroke();
    return output;
}

export {
    generate,
    renderOnCanvas
};
