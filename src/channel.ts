import Client from "./client";
import TypedEmitter, { EventList } from "./typedEmitter";

type EventConversion<T> = {
    [K in keyof T]: (data: T[K]) => void
}

export default class Channel<Events extends {
    [key: string]: any
} = {
    [key: string]: any
}> extends TypedEmitter<EventConversion<Events>> {

    constructor(public readonly name: string) {
        super()
    }

    public send<K extends keyof Events>(client: Client, event: K, data: Parameters<Events[K]>[0]) {
        client.socket.emit(this.name, { event, data })
    }

    public onEvent<K extends keyof Events>(client: Client, event: K, listener: (data: Parameters<Events[K]>[0]) => void) {
        client.socket.on(this.name, (msg: any) => {
            if (msg.event === event) {
                listener(msg.data)
            }
        })
    }
}