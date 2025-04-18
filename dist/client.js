"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const typedEmitter_1 = __importDefault(require("./typedEmitter"));
const channel_1 = __importDefault(require("./channel"));
const subscriberChannel_1 = require("./channels/subscriberChannel");
const pingChannel_1 = require("./channels/pingChannel");
const logger_1 = require("./logger");
class Client extends typedEmitter_1.default {
    constructor() {
        super();
        this.channels = {};
        this.logger = new logger_1.Logger("Protocol");
        this.socket = (0, socket_io_client_1.io)(Client.baseUrl, {
            path: Client.path,
            reconnection: true,
            timeout: 10000,
        });
        this.socket.on("connect", () => {
            this.emit("connect");
        });
        this.socket.on("disconnect", () => {
            this.emit("disconnect");
        });
        this.registerChannel(subscriberChannel_1.SubscriberChannel);
        this.socket.onAny((channel, message) => {
            if (this.channels[channel]) {
                this.channels[channel].emit(message.event, message.data);
            }
        });
        setInterval(() => {
            this.send(pingChannel_1.PingChannel, "ping", {
                message: "ping"
            }).then((response) => {
            });
        }, 10000);
        this.socket.connect();
    }
    registerChannel(channel) {
        this.channels[channel.name] = channel;
    }
    disconnect() {
        this.socket.disconnect();
    }
    subscribe(channel, key) {
        if (this.channels[channel]) {
            return this.channels[channel];
        }
        this.channels[channel] = new channel_1.default(channel);
        this.channels["subscriber"].send(this, "channel:subscribe", { channel, key });
        return this.channels[channel];
    }
    unsubscribe(channel) {
        if (this.channels[channel]) {
            this.channels["subscriber"].send(this, "channel:unsubscribe", { channel });
            delete this.channels[channel];
        }
    }
    send(channel, event, data) {
        return channel.send(this, event, data);
    }
    onEvent(channel, event, listener) {
        channel.onEvent(this, event, listener);
    }
}
Client.baseUrl = "https://gart.sh";
Client.path = "/socket";
exports.default = Client;
//# sourceMappingURL=client.js.map