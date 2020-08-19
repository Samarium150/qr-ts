/**
 * This is the entrypoint of qr.js library
 * @packageDocumentation
 * @module QR
 */

import Options from "./Options";
import {Ecl, Mask, Version} from "./types";
import * as utils from "./utils";

/**
 * Alias *console.log* function for developer on debugging proposes
 *
 * @param message  The same as *console.log*
 * @param optionalParams  The same as *console.log*
 */
function debug(message?: unknown, ...optionalParams: unknown[]): void {
    console.log("qr.js DEBUG:", message, ...optionalParams);
}

/**
 * Generate a QR code in an HTML canvas according to *\<text\>* and *\<options\>*
 *
 * @param text  The string that should be encoded to QR code
 * @param id  The ID of HTMLCanvasElement output
 * @param options  Options for how the QR code generated, details {@link Options | HERE}
 */
function generate(text: unknown, id: unknown, options?: Options): HTMLCanvasElement {
    if (typeof text != "string" || text.length == 0) throw Error("Invalid Input String");
    if (typeof id != "string" || text.length == 0) throw Error("Invalid Input ID");
    const setting: Options = {
        version: 1,
        ecl: "LOW",
        forced: false,
        mask: -1,
        c1: "#000000",
        c2: "#FFFFFF",
        size: 10
    };
    if (options != undefined) {
        if (options.version != undefined && Version.check(options.version)) setting.version = options.version;
        if (options.ecl != undefined && Ecl.check(options.ecl)) setting.ecl = options.ecl;
        if (typeof options.forced == "boolean") setting.forced = options.forced;
        if (options.mask != undefined && Mask.check(options.mask)) setting.mask = options.mask;

        if (utils.isColor(options.c1)) setting.c1 = options.c1;
        else if (options.c1 != undefined) throw Error("Invalid hex color c1");

        if (utils.isColor(options.c2)) setting.c2 = options.c2;
        else if (options.c2 != undefined) throw Error("Invalid hex color c2");

        if (typeof options.size != "number" && options.size != undefined) throw Error("Invalid size choice");
        else if (typeof options.size == "number") setting.size = options.size;
    }
    console.log(setting);
    return utils.generate(text, id, setting);
}

export {
    debug,
    generate
};