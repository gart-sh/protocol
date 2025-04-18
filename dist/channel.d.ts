import Client from "./client";
import TypedEmitter from "./typedEmitter";
type EventConversion<T> = {
    [K in keyof T]: (data: T[K]) => void;
};
export default class Channel<Events extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> extends TypedEmitter<EventConversion<Events>> {
    readonly name: string;
    constructor(name: string);
    send<K extends keyof Events>(client: Client, event: K, data: Parameters<Events[K]>[0]): void;
    onEvent<K extends keyof Events>(client: Client, event: K, listener: (data: Parameters<Events[K]>[0]) => void): void;
}
export {};
//# sourceMappingURL=channel.d.ts.map