'use strict'
let text, version = 1, ecl = "LOW", forced = false, mask = -1;

qr.app.debug("example");
const form = document.getElementById("QR");
const output = document.getElementById("output");

form.onchange = event => {
    const value = event.target.value;
    switch (event.target.name) {
        case "text": text = value; break;
        case "version": version = parseInt(value); break;
        case "ecl": ecl = value; break;
        case "forced": forced = value === "on"; break;
        case "mask": mask = parseInt(value); break;
        default: throw Error("Invalid Form Input");
    }
}

form.onsubmit = event => {
    console.log(text, version, ecl, forced, mask);
    try {
        const code = qr.app.generate(text, version, ecl, forced, mask);
        console.log(code);
    } catch (e) {
        console.log(e);
    }
    return false;
}
