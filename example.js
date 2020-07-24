'use strict'
const qr = require("./dist/index");

qr.app.debug("Import success.");

const test = "Hello, world! 123"

const points = qr.app.getCodePoints(test);
console.log(`code points length: ${points.length}`);

const segments = [qr.app.getSegments(points, "BYTE")];
console.log(`segment data bits length: ${segments[0].data.length}`);
const d = segments[0].data.map(n => n.toString()).join("");
const a = [];
for (let i = 0; i < d.length; i += 8) {
    a.push(parseInt(d.substring(i, i+8), 2).toString(16).padStart(2, "0"));
}
console.log(a.join(" "));

const ecl = "LOW"
const version = qr.app.computeVersion(segments, 1, ecl);
console.log(`version: ${version}, Ec level: ${ecl}`);

const dataCodewords = qr.app.getDataCodeword(segments, version, ecl);
console.log(`data codeword length: ${dataCodewords.length}`);
console.log(dataCodewords.map(dataCodeword => dataCodeword.value.toString(16).padStart(2, "0")).join(" "));

const codewords = qr.app.getCodeword(dataCodewords, version, ecl);
console.log(codewords.map((codeword, index) => `index: ${index} value: ${codeword.value.toString(16).padStart(2, "0")}`).join("\n"));

const code = qr.app.getRawQR(codewords, version, ecl);
qr.app.drawQR(code);

