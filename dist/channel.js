"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = require("./logger.js");
const typedEmitter_js_1 = __importDefault(require("./typedEmitter.js"));
class Channel extends typedEmitter_js_1.default {
    constructor(name, options) {
        super();
        this.name = name;
        this.options = options;
        this.logger = new logger_js_1.Logger(name);
    }
    send(client, event, data) {
        if (!this.options?.disableLogs)
            this.logger.debug(`-> ${event} ${JSON.stringify(data)}`);
        client.socket.emit(this.name, { event, data });
    }
    onEvent(client, event, listener) {
        client.socket.on(this.name, (msg) => {
            if (msg.event === event) {
                listener(msg.data);
            }
        });
    }
}
exports.default = Channel;
//# sourceMappingURL=channel.js.map