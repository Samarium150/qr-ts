'use strict'
const qr = require("./dist/bundle");

qr.app.debug("test");

const test = "HELLO WORLD"

const points = qr.app.getCodePoints(test);
console.log(`code points length: ${points.length}`);

const segments = [qr.app.getSegments(points, "ALPHANUMERIC")];
console.log(`segment data bits length: ${segments[0].data.length}`);
const d = segments[0].data.map(n => n.toString()).join("");
const a = [];
for (let i = 0; i < d.length; i += 8) {
    a.push(parseInt(d.substring(i, i+8), 2).toString(16).padStart(2, "0"));
}
console.log(a.join(" "));

const ecl = "QUARTILE"
const version = qr.app.computeVersion(segments, 1, ecl);
console.log(`version: ${version}, Ec level: ${ecl}`);

const dataCodewords = qr.app.getDataCodeword(segments, version, ecl);
console.log(`data codeword length: ${dataCodewords.length}`);
console.log(dataCodewords.map(dataCodeword => dataCodeword.value.toString(16).padStart(2, "0")).join(" "));

const codewords = qr.app.getCodeword(dataCodewords, version, ecl);
console.log(codewords.map((codeword, index) => `index: ${index} value: ${codeword.value.toString(16).padStart(2, "0")}`).join("\n"));

const rawCode = qr.app.getRawQR(codewords, version, ecl);
qr.app.drawQR(rawCode);
rawCode.applyMask(rawCode.generateMask(0));
rawCode.drawFormatPatterns(0);
console.log(rawCode.computePenalty());
qr.app.drawQR(rawCode);
// const code = qr.app.initQR(version, ecl);
// code.initialize();
// code.drawFormatPatterns(0);
// qr.app.drawQR(code);
