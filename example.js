'use strict'
const qr = require("./dist/index");
qr.app.debug("Import success.");
const test = "9637809637830604226023617830602044144561515315156484113748634163415"
const points = qr.app.getCodePoints(test);
console.log(points.length);
const segments = [qr.app.getSegments(points, "NUMERIC")];
console.log(segments[0].data.length);
console.log(qr.app.computeVersion(segments, 1, "HIGH"));
