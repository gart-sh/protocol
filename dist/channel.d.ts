import { Logger } from "./logger.js";
import Client from "./client.js";
import TypedEmitter from "./typedEmitter.js";
type EventConversion<T> = {
    [K in keyof T]: (data: T[K]) => void;
};
export interface ChannelOptions {
    disableLogs: boolean;
}
export default class Channel<Events extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> extends TypedEmitter<EventConversion<Events>> {
    readonly name: string;
    readonly options?: ChannelOptions | undefined;
    readonly logger: Logger;
    constructor(name: string, options?: ChannelOptions | undefined);
    send<K extends keyof Events>(client: Client, event: K, data: Events[K]): void;
    onEvent<K extends keyof Events>(client: Client, event: K, listener: (data: Events[K]) => void): void;
}
export {};
//# sourceMappingURL=channel.d.ts.map