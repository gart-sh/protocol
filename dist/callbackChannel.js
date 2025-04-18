import Channel from "./channel.js";
export default class CallbackChannel extends Channel {
    constructor(name, options) {
        super(name, options);
    }
    send(client, event, data) {
        return new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substr(2, 9);
            if (!this.options?.disableLogs)
                this.logger.debug(`/-> ${event} ${JSON.stringify(data)}`);
            client.socket.emit(this.name, {
                event, data: {
                    requestId,
                    data
                }
            });
            const listener = (msg) => {
                if (msg.data.requestId === requestId) {
                    client.socket.off(this.name, listener);
                    if (msg.error) {
                        reject(msg.error);
                    }
                    else {
                        resolve(msg.data);
                    }
                }
            };
            client.socket.on(this.name, listener);
        });
    }
}
//# sourceMappingURL=callbackChannel.js.map