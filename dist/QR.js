"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants = __importStar(require("./constants"));
var Module_1 = require("./Module");
var ecls;
(function (ecls) {
    ecls[ecls["LOW"] = 0] = "LOW";
    ecls[ecls["MEDIUM"] = 1] = "MEDIUM";
    ecls[ecls["QUARTILE"] = 2] = "QUARTILE";
    ecls[ecls["HIGH"] = 3] = "HIGH";
})(ecls || (ecls = {}));
var QR = /** @class */ (function () {
    function QR(version, ecl) {
        this.modules = [];
        this.version = version;
        this.ecl = ecl;
        this.size = version * 4 + 17;
        for (var i = 0; i < this.size; i++) {
            var row = [];
            for (var j = 0; j < this.size; j++)
                row.push(new Module_1.Module());
            this.modules.push(row);
        }
        this.initialize();
    }
    QR.getBitAt = function (bits, index, reverse) {
        return reverse ? (bits >>> (bits.toString(2).length - index - 1)) & 1 : (bits >>> index) & 1;
    };
    QR.prototype.initialize = function () {
        this.drawTimingPatterns();
        this.drawFinderPatterns();
        this.drawSeparatorPatterns();
        this.drawAlignmentPatterns();
        this.drawDarkPattern();
        this.drawFormatPatterns();
        this.drawVersionInfoPatterns();
    };
    QR.prototype.drawTimingPatterns = function () {
        for (var i = 0; i < this.size; i++) {
            var color = i % 2 == 0;
            // row 6
            this.modules[6][i] = new Module_1.FunctionalModule("TIMING", color);
            // column 6
            this.modules[i][6] = new Module_1.FunctionalModule("TIMING", color);
        }
    };
    QR.prototype.drawFinderPatterns = function () {
        var pos = [
            // Top-left, Top-Right, Bottom-left
            [0, 0], [this.size - 7, 0], [0, this.size - 7]
        ];
        for (var _i = 0, pos_1 = pos; _i < pos_1.length; _i++) {
            var _a = pos_1[_i], x = _a[0], y = _a[1];
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    if (i == 0 || i == 6)
                        this.modules[x + i][y + j] = new Module_1.FunctionalModule("FINDER", true);
                    else if (i == 1 || i == 5)
                        this.modules[x + i][y + j] = new Module_1.FunctionalModule("FINDER", !(j != 0 && j != 6));
                    else
                        this.modules[x + i][y + j] = new Module_1.FunctionalModule("FINDER", (j != 1 && j != 5));
                }
            }
        }
    };
    QR.prototype.drawSeparatorPatterns = function () {
        var pos1 = [
            // row placed
            [7, 0], [7, this.size - 8], [this.size - 8, 0]
        ];
        var pos2 = [
            // column placed
            [0, 7], [0, this.size - 8], [this.size - 8, 7]
        ];
        for (var _i = 0, pos1_1 = pos1; _i < pos1_1.length; _i++) {
            var _a = pos1_1[_i], x = _a[0], y = _a[1];
            for (var i = 0; i < 8; i++)
                this.modules[x][y + i] = new Module_1.FunctionalModule("SEPARATOR", false);
        }
        for (var _b = 0, pos2_1 = pos2; _b < pos2_1.length; _b++) {
            var _c = pos2_1[_b], x = _c[0], y = _c[1];
            for (var i = 0; i < 8; i++)
                this.modules[x + i][y] = new Module_1.FunctionalModule("SEPARATOR", false);
        }
    };
    QR.prototype.drawAlignmentPatterns = function () {
        if (this.version == 1)
            return;
        var p = constants.ALIGNMENT_POSITION[this.version];
        // combine row and column position
        for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
            var x = p_1[_i];
            for (var _a = 0, p_2 = p; _a < p_2.length; _a++) {
                var y = p_2[_a];
                var module_1 = this.modules[x][y];
                if (module_1 instanceof Module_1.FunctionalModule && module_1.getType() != "TIMING")
                    continue;
                var pos = [x - 2, y - 2];
                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var px = pos[0] + i, py = pos[1] + j;
                        if (i == 0 || i == 4)
                            this.modules[px][py] = new Module_1.FunctionalModule("ALIGNMENT", true);
                        else if (i == 1 || i == 3)
                            this.modules[px][py] = new Module_1.FunctionalModule("ALIGNMENT", !(j != 0 && j != 4));
                        else
                            this.modules[px][py] = new Module_1.FunctionalModule("ALIGNMENT", (j != 1 && j != 3));
                    }
                }
            }
        }
    };
    QR.prototype.drawDarkPattern = function () {
        this.modules[this.version * 4 + 9][8] = new Module_1.FunctionalModule("Dark", true);
    };
    QR.prototype.drawFormatPatterns = function (mask) {
        var bits = (mask != undefined) ? constants.FORMAT_INFO[ecls[this.ecl]][mask] : 0;
        // 0 - 6
        for (var i = 0; i < 7; i++) {
            var color = QR.getBitAt(bits, i, true) != 0;
            this.modules[8][(i != 6) ? i : i + 1] = new Module_1.FunctionalModule("FORMAT_INFO", color);
            this.modules[this.size - i - 1][8] = new Module_1.FunctionalModule("FORMAT_INFO", color);
        }
        // 7 - 14
        for (var i = 0; i < 8; i++) {
            var color = QR.getBitAt(bits, i + 7, true) != 0;
            this.modules[8][this.size - 8 + i] = new Module_1.FunctionalModule("FORMAT_INFO", color);
            this.modules[(i < 2) ? 8 - i : 7 - i][8] = new Module_1.FunctionalModule("FORMAT_INFO", color);
        }
    };
    QR.prototype.drawVersionInfoPatterns = function () {
        if (this.version < 7)
            return;
        var bits = constants.VERSION_INFO[this.version - 7];
        for (var i = 0; i < 18; i++) {
            var x = Math.floor(i / 3);
            var y = this.size - 11 + i % 3;
            var color = QR.getBitAt(bits, i, false) != 0;
            this.modules[x][y] = new Module_1.FunctionalModule("VERSION_INFO", color);
            this.modules[y][x] = new Module_1.FunctionalModule("VERSION_INFO", color);
        }
    };
    QR.prototype.generateDataPath = function () {
        var result = [];
        for (var col = this.size - 1; col > 0; col -= 2) {
            if (col == 6)
                col = 5; // Skip the vertical Timing Pattern
            for (var row = 0; row < this.size; row++) {
                for (var i = 0; i < 2; i++) {
                    var upward = ((col + 1) & 2) == 0;
                    var x = upward ? this.size - row - 1 : row;
                    var y = col - i;
                    if (this.modules[x][y] instanceof Module_1.FunctionalModule)
                        continue;
                    result.push([x, y]);
                }
            }
        }
        return result;
    };
    QR.prototype.placeCodeword = function (data, path) {
        var _this = this;
        path.forEach(function (_a, index) {
            var x = _a[0], y = _a[1];
            var module = new Module_1.Module();
            if (index < data.length * 8) {
                var codeword = data[index >>> 3];
                module.setColor(QR.getBitAt(codeword.value, 7 - (index & 7), false) != 0);
                index++;
            }
            else {
                module.setColor(false);
            }
            _this.modules[x][y] = module;
        });
    };
    return QR;
}());
exports.default = QR;
