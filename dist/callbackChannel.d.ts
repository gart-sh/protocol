import Channel, { ChannelOptions } from "./channel.js";
import Client from "./client.js";
export interface MessageResponse<T> {
    sender: string;
    timestamp: number;
    requestId: string;
    data: T;
}
export default class CallbackChannel<DataType extends {
    [eventName: string]: {
        request: any;
        response: any;
    };
} = {
    [eventName: string]: {
        request: any;
        response: any;
    };
}> extends Channel<{
    [eventName in keyof DataType]: (data: DataType[eventName]["request"]) => Promise<DataType[eventName]["response"]>;
}> {
    constructor(name: string, options?: ChannelOptions);
    send<K extends keyof DataType>(client: Client, event: K, data: DataType[K]["request"]): Promise<MessageResponse<DataType[K]["response"]>>;
}
//# sourceMappingURL=callbackChannel.d.ts.map