import { Logger } from "./logger.js";
import Client from "./client.js";
import TypedEmitter from "./typedEmitter.js";

type EventConversion<T> = {
    [K in keyof T]: (data: T[K]) => void
}

export interface ChannelOptions {
    /**
     * Disable debug logs for this channel
     */
    disableLogs: boolean
}

export default class Channel<Events extends {
    [key: string]: any
} = {
    [key: string]: any
}> extends TypedEmitter<EventConversion<Events>> {

    public readonly logger: Logger

    constructor(public readonly name: string, public readonly options?: ChannelOptions) {
        super()
        this.logger = new Logger(name);
    }

    public send<K extends keyof Events>(client: Client, event: K, data: Events[K]) {
        if (!this.options?.disableLogs) this.logger.debug(`-> ${event as string} ${JSON.stringify(data)}`)
        client.socket.emit(this.name, { event, data })
    }

    public onEvent<K extends keyof Events>(client: Client, event: K, listener: (data: Events[K]) => void) {
        client.socket.on(this.name, (msg: any) => {
            if (msg.event === event) {
                listener(msg.data)
            }
        })
    }
}