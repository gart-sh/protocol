"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = __importDefault(require("./channel"));
class CallbackChannel extends channel_1.default {
    constructor(name) {
        super(name);
    }
    send(client, event, data) {
        return new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substr(2, 9);
            client.socket.emit(this.name, {
                event, data: {
                    requestId,
                    data
                }
            });
            const listener = (msg) => {
                if (msg.data.requestId === requestId) {
                    client.socket.off(this.name, listener);
                    if (msg.error) {
                        reject(msg.error);
                    }
                    else {
                        resolve(msg.data);
                    }
                }
            };
            client.socket.on(this.name, listener);
        });
    }
}
exports.default = CallbackChannel;
//# sourceMappingURL=callbackChannel.js.map