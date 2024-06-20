import { Socket, io } from "socket.io-client";
import TypedEmitter, { EventList } from "./typedEmitter";
import Channel from "./channel";
import CallbackChannel from "./callbackChannel";
import { SubscriberChannel } from "./channels/subscriberChannel";
import { PingChannel } from "./channels/pingChannel";
import { Logger } from "./logger";

interface ClientEvents {
    [key: string]: (...args: any[]) => void;
    connect: () => void;
    disconnect: () => void;
}

interface SocketEvents {
    [key: string]: any
}




export default class Client extends TypedEmitter<ClientEvents> {

    public static readonly baseUrl = "https://gart.sh";
    public static readonly path = "/socket";

    public socket: Socket<SocketEvents, SocketEvents>;
    public channels: Record<string, Channel | CallbackChannel> = {};

    public logger = new Logger("Protocol");

    constructor() {
        super();
        this.socket = io(Client.baseUrl, {
            path: Client.path,
            reconnection: true,
            timeout: 10000,
        })

        this.socket.on("connect", () => {
            this.emit("connect")
        });

        this.socket.on("disconnect", () => {
            this.emit("disconnect")
        });

        this.registerChannel(SubscriberChannel);

        this.socket.onAny((channel, message) => {
            if (this.channels[channel]) {

                (this.channels[channel] as Channel<any>).emit(message.event, message.data);
            }
        })

        setInterval(() => {
            this.send(PingChannel, "ping", {
                message: "ping"
            }).then((response) => {

            })
        }, 10000)

        this.socket.connect();
    }

    public registerChannel(channel: Channel<any> | CallbackChannel<any>) {
        this.channels[channel.name] = channel;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public subscribe<T extends EventList>(channel: string, key?: string): Channel<T> {
        if (this.channels[channel]) {
            return this.channels[channel] as Channel<T>;
        }

        this.channels[channel] = new Channel<T>(channel);
        (this.channels["subscriber"] as CallbackChannel).send(this, "channel:subscribe", { channel, key });

        return this.channels[channel] as Channel<T>;
    }

    public unsubscribe(channel: string) {
        if (this.channels[channel]) {
            (this.channels["subscriber"] as CallbackChannel).send(this, "channel:unsubscribe", { channel });
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