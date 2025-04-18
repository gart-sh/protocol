"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.Client = exports.Protocol = void 0;
const client_1 = __importDefault(require("./client"));
const logger_1 = require("./logger");
var Protocol;
(function (Protocol) {
    Protocol.Client = client_1.default;
    Protocol.Logger = logger_1.Logger;
})(Protocol || (exports.Protocol = Protocol = {}));
exports.default = Protocol;
var client_2 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return __importDefault(client_2).default; } });
var logger_2 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return __importDefault(logger_2).default; } });
//# sourceMappingURL=index.js.map