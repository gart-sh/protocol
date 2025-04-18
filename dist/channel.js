import { Logger } from "./logger.js";
import TypedEmitter from "./typedEmitter.js";
export default class Channel extends TypedEmitter {
    name;
    options;
    logger;
    constructor(name, options) {
        super();
        this.name = name;
        this.options = options;
        this.logger = new Logger(name);
    }
    send(client, event, data) {
        if (!this.options?.disableLogs)
            this.logger.debug(`-> ${event} ${JSON.stringify(data)}`);
        client.socket.emit(this.name, { event, data });
    }
    onEvent(client, event, listener) {
        client.socket.on(this.name, (msg) => {
            if (msg.event === event) {
                listener(msg.data);
            }
        });
    }
}
//# sourceMappingURL=channel.js.map