import client from "./client";
import { Logger as logger } from "./logger";
import channel from "./channel";
import callbackChannel from "./callbackChannel";
import { SubscriberChannel as subscriberChannel } from "./channels/subscriberChannel";
import { PingChannel as pingChannel } from "./channels/pingChannel";

export namespace Protocol {
    export const Client = client;
    export const Logger = logger;
    export const Channel = channel;
    export const CallbackChannel = callbackChannel;
    export const SubscriberChannel = subscriberChannel;
    export const PingChannel = pingChannel;
}

export default Protocol;
export { default as Client } from "./client";
export { default as Logger } from "./logger";
export { default as Channel } from "./channel";
export { default as CallbackChannel } from "./callbackChannel";
export { SubscriberChannel } from "./channels/subscriberChannel";
export { PingChannel } from "./channels/pingChannel";