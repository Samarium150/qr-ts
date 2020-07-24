"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var utils_1 = require("./utils");
var QR_1 = __importDefault(require("./QR"));
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
    function getDataCodeword(segments, version, ecl) {
        return utils_1.utils.generateDataCodeword(segments, version, ecl);
    }
    app.getDataCodeword = getDataCodeword;
    function getCodeword(data, version, ecl) {
        return utils_1.utils.generateCodeword(data, version, ecl);
    }
    app.getCodeword = getCodeword;
    function initQR(version, ecl) {
        return new QR_1.default(version, ecl);
    }
    app.initQR = initQR;
    function drawQR(qr) {
        console.log(qr.modules.map(function (row) { return row.map(function (module) { return module.getColor() ? 1 : 0; }).join("  "); }).join("\n"));
    }
    app.drawQR = drawQR;
    function getRawQR(data, version, ecl) {
        return utils_1.utils.generateRawQR(data, version, ecl);
    }
    app.getRawQR = getRawQR;
})(app = exports.app || (exports.app = {}));
