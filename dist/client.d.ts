import { Socket } from "socket.io-client";
import TypedEmitter, { EventList } from "./typedEmitter.js";
import Channel from "./channel.js";
import CallbackChannel from "./callbackChannel.js";
import { Logger } from "./logger.js";
interface ClientEvents {
    [key: string]: (...args: any[]) => void;
    connect: () => void;
    disconnect: () => void;
}
interface SocketEvents {
    [key: string]: any;
}
export default class Client extends TypedEmitter<ClientEvents> {
    readonly host: string;
    readonly path: string;
    socket: Socket<SocketEvents, SocketEvents>;
    channels: Record<string, Channel | CallbackChannel>;
    subscriptions: Set<string>;
    logger: Logger;
    constructor(host?: string, path?: string);
    registerChannel(channel: Channel<any> | CallbackChannel<any>): void;
    disconnect(): void;
    subscribe<T extends EventList>(channel: string | Channel<any> | CallbackChannel<any>, key?: string): Channel<T>;
    unsubscribe(channel: string | Channel<any> | CallbackChannel<any>): void;
    send<ChannelType extends Channel<any> | CallbackChannel<any>, Event extends Parameters<ChannelType["send"]>[1]>(channel: ChannelType, event: Event, data: Parameters<ChannelType["send"]>[2]): ReturnType<ChannelType["send"]>;
    onEvent<T extends Channel<any> | CallbackChannel<any>>(channel: T, event: Parameters<T["onEvent"]>[1], listener: Parameters<T["onEvent"]>[2]): void;
}
export {};
//# sourceMappingURL=client.d.ts.map