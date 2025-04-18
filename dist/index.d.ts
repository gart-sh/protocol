import client from "./client";
import { Logger as logger } from "./logger";
import channel from "./channel";
import callbackChannel from "./callbackChannel";
export declare namespace Protocol {
    const Client: typeof client;
    const Logger: typeof logger;
    const Channel: typeof channel;
    const CallbackChannel: typeof callbackChannel;
    const SubscriberChannel: callbackChannel<{
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
    const PingChannel: callbackChannel<{
        ping: {
            request: {
                message: string;
            };
            response: {
                message: string;
            };
        };
    }>;
}
export default Protocol;
export { default as Client } from "./client";
export { default as Logger } from "./logger";
export { default as Channel } from "./channel";
export { default as CallbackChannel } from "./callbackChannel";
export { SubscriberChannel } from "./channels/subscriberChannel";
export { PingChannel } from "./channels/pingChannel";
//# sourceMappingURL=index.d.ts.map