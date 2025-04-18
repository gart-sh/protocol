import CallbackChannel from "../callbackChannel";
export declare const SubscriberChannel: CallbackChannel<{
    "channel:subscribe": {
        request: {
            channel: string;
            key?: string;
        };
        response: {
            success: boolean;
            channel: string;
            error?: string;
        };
    };
    "channel:unsubscribe": {
        request: {
            channel: string;
        };
        response: {
            success: boolean;
            channel: string;
            error?: string;
        };
    };
}>;
//# sourceMappingURL=subscriberChannel.d.ts.map