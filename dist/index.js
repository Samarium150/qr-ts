"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/**
 *
 */
var utils_1 = require("./utils");
var CodePoint_1 = __importDefault(require("./CodePoint"));
var Segment_1 = __importDefault(require("./Segment"));
var app;
(function (app) {
    function debug(str) {
        console.log("DEBUG: " + str);
    }
    app.debug = debug;
    function getCodePoints(str) {
        return CodePoint_1.default.generate(str);
    }
    app.getCodePoints = getCodePoints;
    function getSegments(points, mode) {
        return Segment_1.default.generateFromSingleMode(points, mode);
    }
    app.getSegments = getSegments;
    function computeVersion(segments, version, ecl) {
        return utils_1.utils.computeOptimalVersion(segments, version, ecl);
    }
    app.computeVersion = computeVersion;
})(app = exports.app || (exports.app = {}));
