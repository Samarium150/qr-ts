"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var utils_1 = require("./utils");
var app;
(function (app) {
    function debug(str) {
        console.log("DEBUG: " + str);
    }
    app.debug = debug;
    function getCodePoints(str) {
        return utils_1.utils.generateCodePoint(str);
    }
    app.getCodePoints = getCodePoints;
    function getSegments(points, mode) {
        return utils_1.utils.generateSegmentFromSingleMode(points, mode);
    }
    app.getSegments = getSegments;
    function computeVersion(segments, version, ecl) {
        return utils_1.utils.computeOptimalVersion(segments, version, ecl);
    }
    app.computeVersion = computeVersion;
    function getDataCodeword(segments, version) {
        return utils_1.utils.generateDataCodeword(segments, version);
    }
    app.getDataCodeword = getDataCodeword;
    function getCodeword(data, version, ecl) {
        return utils_1.utils.generateCodeword(data, version, ecl);
    }
    app.getCodeword = getCodeword;
})(app = exports.app || (exports.app = {}));
