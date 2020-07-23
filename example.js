'use strict'
const qr = require("./dist/index");
qr.app.debug("Import success.");
const test = "Hello, world! 123"
const points = qr.app.getCodePoints(test);
console.log(points.length);
const segments = [qr.app.getSegments(points, "BYTE")];
console.log(segments[0].data.length);
const ecl = "LOW"
const version = qr.app.computeVersion(segments, 1, ecl);
console.log(`version: ${version}, Ec level: ${ecl}`);
const dataCodeword = qr.app.getDataCodeword(segments, version);
console.log(dataCodeword.length);
const codeword = qr.app.getCodeword(dataCodeword, version, ecl);
console.log(codeword.length);
