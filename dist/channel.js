"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedEmitter_1 = __importDefault(require("./typedEmitter"));
class Channel extends typedEmitter_1.default {
    constructor(name) {
        super();
        this.name = name;
    }
    send(client, event, data) {
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