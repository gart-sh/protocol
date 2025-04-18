import client from "./client";
import { Logger as logger } from "./logger";

export namespace Protocol {
    export const Client = client;
    export const Logger = logger;
}

export default Protocol;
export { default as Client } from "./client";
export { default as Logger } from "./logger";