import CallbackChannel from "../callbackChannel.js";

export const SubscriberChannel = new CallbackChannel<{
    "channel:subscribe": {
        request: { channel: string, key?: string },
        response: {
            success: boolean,
            channel: string,
            error?: string
        }
    },
    "channel:unsubscribe": {
        request: { channel: string },
        response: {
            success: boolean,
            channel: string,
            error?: string
        }
    }
}>("subscriber");
