import { io } from "socket.io-client";
import TypedEmitter from "./typedEmitter.js";
import Channel from "./channel.js";
import { SubscriberChannel } from "./channels/subscriberChannel.js";
import { PingChannel } from "./channels/pingChannel.js";
import GlobalLogger, { Logger } from "./logger.js";
export default class Client extends TypedEmitter {
    host;
    path;
    socket;
    channels = {};
    subscriptions = new Set();
    logger = new Logger("Protocol");
    constructor(host = "https://gart.sh", path = "/socket") {
        super();
        this.host = host;
        this.path = path;
        this.socket = io(host, {
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
        this.registerChannel(SubscriberChannel);
        this.socket.onAny((channel, message) => {
            const channelInstance = this.channels[channel];
            if (channelInstance) {
                if (!channelInstance?.options?.disableLogs)
                    GlobalLogger.debug(channel, `<- ${message.event} ${JSON.stringify(message.data)}`);
                channelInstance.emit(message.event, message.data);
            }
        });
        setInterval(() => {
            this.send(PingChannel, "ping", {
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
        this.channels[channel] = new Channel(channel);
        SubscriberChannel.send(this, "channel:subscribe", { channel, key });
        return this.channels[channel];
    }
    unsubscribe(channel) {
        if (typeof channel === "object") {
            channel = channel.name;
        }
        this.subscriptions.delete(channel);
        if (this.channels[channel]) {
            SubscriberChannel.send(this, "channel:unsubscribe", { channel });
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
//# sourceMappingURL=client.js.map