import { Socket, io } from "socket.io-client";
import TypedEmitter, { EventList } from "./typedEmitter.js";
import Channel from "./channel.js";
import CallbackChannel from "./callbackChannel.js";
import { SubscriberChannel } from "./channels/subscriberChannel.js";
import { PingChannel } from "./channels/pingChannel.js";
import GlobalLogger, { Logger } from "./logger.js";

interface ClientEvents {
    [key: string]: (...args: any[]) => void;
    connect: () => void;
    disconnect: () => void;
}

interface SocketEvents {
    [key: string]: any
}

export default class Client extends TypedEmitter<ClientEvents> {

    public socket: Socket<SocketEvents, SocketEvents>;
    public channels: Record<string, Channel | CallbackChannel> = {};
    public subscriptions: Set<string> = new Set();

    public logger = new Logger("Protocol");

    constructor(public readonly host: string = "https://gart.sh", public readonly path: string = "/socket") {
        super();
        this.socket = io(host, {
            path: path,
            reconnection: true,
            timeout: 10000,
        })

        this.socket.on("connect", () => {
            this.emit("connect")
        });

        this.socket.on("disconnect", () => {
            this.emit("disconnect")

            // on the possibility of a disconnect, the gateway may have restarted.
            // we should clear all channels and resubscribe once we reconnect.
            this.channels = {};
            this.subscriptions.clear();
        });

        this.registerChannel(SubscriberChannel);

        this.socket.onAny((channel, message) => {
            const channelInstance = this.channels[channel] as Channel<any>
            if (channelInstance) {
                if (!channelInstance?.options?.disableLogs) GlobalLogger.debug(channel, `<- ${message.event} ${JSON.stringify(message.data)}`);
                channelInstance.emit(message.event, message.data);
            }
        })

        setInterval(() => {
            this.send(PingChannel, "ping", {
                message: "ping"
            })
        }, 10000)

        this.on("error", (error) => {
            this.logger.error(error);
        })

        this.socket.connect();
    }

    public registerChannel(channel: Channel<any> | CallbackChannel<any>) {
        this.channels[channel.name] = channel;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public subscribe<T extends EventList>(channel: string | Channel<any> | CallbackChannel<any>, key?: string): Channel<T> {
        if (typeof channel === "object") {
            channel = channel.name;
        }

        this.subscriptions.add(channel);

        if (this.channels[channel]) {
            return this.channels[channel] as Channel<T>;
        }

        this.channels[channel] = new Channel<T>(channel);
        SubscriberChannel.send(this, "channel:subscribe", { channel, key });

        return this.channels[channel] as Channel<T>;
    }

    public unsubscribe(channel: string | Channel<any> | CallbackChannel<any>) {
        if (typeof channel === "object") {
            channel = channel.name;
        }

        this.subscriptions.delete(channel);

        if (this.channels[channel]) {
            SubscriberChannel.send(this, "channel:unsubscribe", { channel });
            delete this.channels[channel];
        }
    }

    public send<ChannelType extends Channel<any> | CallbackChannel<any>, Event extends Parameters<ChannelType["send"]>[1]>(channel: ChannelType, event: Event, data: Parameters<ChannelType["send"]>[2]): ReturnType<ChannelType["send"]> {
        return channel.send(this, event, data) as any;
    }

    public onEvent<T extends Channel<any> | CallbackChannel<any>>(channel: T, event: Parameters<T["onEvent"]>[1], listener: Parameters<T["onEvent"]>[2]): void {
        channel.onEvent(this, event, listener);
    }

}