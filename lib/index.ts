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
 * @param options  Options for how the QR code generated, details {@link Options | HERE}
 */
function generate(text: unknown, options?: Options): HTMLCanvasElement {
    if (typeof text != "string" || text.length == 0) throw Error("Invalid Input String");
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
        if (Version.check(options.version)) setting.version = options.version;
        if (Ecl.check(options.ecl)) setting.ecl = options.ecl;
        if (typeof options.forced == "boolean") setting.forced = options.forced;
        if (Mask.check(options.mask)) setting.mask = options.mask;

        if (utils.isColor(options.c1)) setting.c1 = options.c1;
        else if (options.c1 != undefined) throw Error("Invalid hex color");

        if (utils.isColor(options.c1)) setting.c2 = options.c2;
        else if (options.c2 != undefined) throw Error("Invalid hex color");

        if (typeof options.size != ("number" || "undefined")) throw Error("Invalid size choice");
        else setting.size = options.size;
    }
    return utils.generate(text, setting);
}

export {
    debug,
    generate
};