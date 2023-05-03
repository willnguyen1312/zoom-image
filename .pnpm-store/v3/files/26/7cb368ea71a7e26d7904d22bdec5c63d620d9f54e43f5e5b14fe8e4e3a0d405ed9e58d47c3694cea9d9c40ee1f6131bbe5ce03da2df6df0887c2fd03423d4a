"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseId = exports.createFilter = void 0;
var pluginutils_1 = require("@rollup/pluginutils");
Object.defineProperty(exports, "createFilter", { enumerable: true, get: function () { return pluginutils_1.createFilter; } });
// Allows to ignore query parameters, as in Vue SFC virtual modules.
function parseId(url) {
    return { id: url.split("?", 2)[0] };
}
exports.parseId = parseId;
