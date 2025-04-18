import Channel from "./channel";
import Client from "./client";
export interface MessageResponse<T> {
    sender: string;
    timestamp: number;
    reqeustId: string;
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
    constructor(name: string);
    send<K extends keyof DataType>(client: Client, event: K, data: DataType[K]["request"]): Promise<MessageResponse<DataType[K]["response"]>>;
}
//# sourceMappingURL=callbackChannel.d.ts.map