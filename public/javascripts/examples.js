"use strict"
let text = undefined, version = undefined,
    ecl = undefined, forced = undefined, mask = undefined,
    c1 = undefined, c2 = undefined, size = undefined;

const default_form = document.getElementById("example-default"),
    default_out = document.getElementById("by-default"),
    options_form = document.getElementById("example-options"),
    options_out = document.getElementById("by-options");

default_form.onchange = event => text = event.target.value;
default_form.onsubmit = event => {
    try {
        if (text === undefined) {
            event.preventDefault();
            event.stopPropagation();
        }
        const code = qr.generate(text, "default_output");
        const prev = document.getElementById("default_output");
        if (prev != null) prev.replaceWith(code);
        else default_out.appendChild(code);
    } catch (e) {
        console.log(e);
    }
    return false;
}

options_form.onchange = event => {
    const value = event.target.value;
    console.log(`value: ${value}`);
    switch (event.target.name) {
        case "text": text = value; break;
        case "version": version = parseInt(value); break;
        case "ecl": ecl = value; break;
        case "forced": forced = value === "on"; break;
        case "mask": mask = parseInt(value); break;
        case "c1": c1 = value; break;
        case "c2": c2 = value; break;
        case "size": size = parseInt(value); break;
        default: throw Error("Invalid Form Input");
    }
}
options_form.onsubmit = event => {
    try {
        if (text === undefined) {
            event.preventDefault();
            event.stopPropagation();
        }
        const code = qr.generate(text, "options_output", {
            version: version, ecl: ecl, forced: forced,
            mask: mask, c1: c1, c2: c2, size: size
        });
        const prev = document.getElementById("options_output");
        if (prev != null) prev.replaceWith(code);
        else options_out.appendChild(code);
    } catch (e) {
        console.log(e);
    }
    return false;
}
