"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const typedEmitter_js_1 = __importDefault(require("./typedEmitter.js"));
const channel_js_1 = __importDefault(require("./channel.js"));
const subscriberChannel_js_1 = require("./channels/subscriberChannel.js");
const pingChannel_js_1 = require("./channels/pingChannel.js");
const logger_js_1 = __importStar(require("./logger.js"));
class Client extends typedEmitter_js_1.default {
    constructor(host = "https://gart.sh", path = "/socket") {
        super();
        this.host = host;
        this.path = path;
        this.channels = {};
        this.subscriptions = new Set();
        this.logger = new logger_js_1.Logger("Protocol");
        this.socket = (0, socket_io_client_1.io)(host, {
            path: path,
            reconnection: true,
            timeout: 10000,
        });
        this.socket.on("connect", () => {
            this.emit("connect");
        });
        this.socket.on("disconnect", () => {
            this.emit("disconnect");
            this.channels = {};
            this.subscriptions.clear();
        });
        this.registerChannel(subscriberChannel_js_1.SubscriberChannel);
        this.socket.onAny((channel, message) => {
            const channelInstance = this.channels[channel];
            if (channelInstance) {
                if (!channelInstance?.options?.disableLogs)
                    logger_js_1.default.debug(channel, `<- ${message.event} ${JSON.stringify(message.data)}`);
                channelInstance.emit(message.event, message.data);
            }
        });
        setInterval(() => {
            this.send(pingChannel_js_1.PingChannel, "ping", {
                message: "ping"
            });
        }, 10000);
        this.on("error", (error) => {
            this.logger.error(error);
        });
        this.socket.connect();
    }
    registerChannel(channel) {
        this.channels[channel.name] = channel;
    }
    disconnect() {
        this.socket.disconnect();
    }
    subscribe(channel, key) {
        if (typeof channel === "object") {
            channel = channel.name;
        }
        this.subscriptions.add(channel);
        if (this.channels[channel]) {
            return this.channels[channel];
        }
        this.channels[channel] = new channel_js_1.default(channel);
        subscriberChannel_js_1.SubscriberChannel.send(this, "channel:subscribe", { channel, key });
        return this.channels[channel];
    }
    unsubscribe(channel) {
        if (typeof channel === "object") {
            channel = channel.name;
        }
        this.subscriptions.delete(channel);
        if (this.channels[channel]) {
            subscriberChannel_js_1.SubscriberChannel.send(this, "channel:unsubscribe", { channel });
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
exports.default = Client;
//# sourceMappingURL=client.js.map