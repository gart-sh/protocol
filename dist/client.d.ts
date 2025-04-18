import { Socket } from "socket.io-client";
import TypedEmitter, { EventList } from "./typedEmitter";
import Channel from "./channel";
import CallbackChannel from "./callbackChannel";
import { Logger } from "./logger";
interface ClientEvents {
    [key: string]: (...args: any[]) => void;
    connect: () => void;
    disconnect: () => void;
}
interface SocketEvents {
    [key: string]: any;
}
export default class Client extends TypedEmitter<ClientEvents> {
    static readonly baseUrl = "https://gart.sh";
    static readonly path = "/socket";
    socket: Socket<SocketEvents, SocketEvents>;
    channels: Record<string, Channel | CallbackChannel>;
    logger: Logger;
    constructor();
    registerChannel(channel: Channel<any> | CallbackChannel<any>): void;
    disconnect(): void;
    subscribe<T extends EventList>(channel: string, key?: string): Channel<T>;
    unsubscribe(channel: string): void;
    send<ChannelType extends Channel<any> | CallbackChannel<any>, Event extends Parameters<ChannelType["send"]>[1]>(channel: ChannelType, event: Event, data: Parameters<ChannelType["send"]>[2]): ReturnType<ChannelType["send"]>;
    onEvent<T extends Channel<any> | CallbackChannel<any>>(channel: T, event: Parameters<T["onEvent"]>[1], listener: Parameters<T["onEvent"]>[2]): void;
}
export {};
//# sourceMappingURL=client.d.ts.map