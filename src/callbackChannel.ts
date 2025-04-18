import Channel, { ChannelOptions } from "./channel.js"
import Client from "./client.js"

export interface MessageResponse<T> {
    sender: string,
    timestamp: number,
    requestId: string,
    data: T,
}

export default class CallbackChannel<DataType extends
    {
        [eventName: string]: {
            request: any,
            response: any
        }
    } = {
        [eventName: string]: {
            request: any,
            response: any
        }
    }> extends Channel<{
        [eventName in keyof DataType]: (data: DataType[eventName]["request"]) => Promise<DataType[eventName]["response"]>
    }> {

    constructor(name: string, options?: ChannelOptions) {
        super(name, options)
    }

    public send<K extends keyof DataType>(client: Client, event: K, data: DataType[K]["request"]): Promise<MessageResponse<DataType[K]["response"]>> {
        return new Promise<DataType[K]["response"]>((resolve, reject) => {
            const requestId = Math.random().toString(36).substr(2, 9)
            if (!this.options?.disableLogs) this.logger.debug(`/-> ${event as string} ${JSON.stringify(data)}`)

            client.socket.emit(this.name, {
                event, data: {
                    requestId,
                    data
                }
            })

            const listener = (msg: any) => {
                if (msg.data.requestId === requestId) {
                    client.socket.off(this.name, listener)
                    if (msg.error) {
                        reject(msg.error)
                    } else {
                        resolve(msg.data)
                    }
                }
            }

            client.socket.on(this.name, listener)
        })
    }
}