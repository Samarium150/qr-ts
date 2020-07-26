'use strict'
let text, version = 1, ecl = "LOW", forced = false, mask = -1;

// qr.app.debug("example");
const form = document.getElementById("QR");
const main = document.getElementById("main");

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

form.onsubmit = _ => {
    // console.log(text, version, ecl, forced, mask);
    try {
        // load library before usage
        const code = qr.app.generate(text, version, ecl, forced, mask);
        const prev = document.getElementById("output");
        if (prev != null) prev.replaceWith(code);
        else main.appendChild(code);
    } catch (e) {
        console.log(e);
    }
    return false;
}
