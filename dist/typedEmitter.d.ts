export type EventList = {
    [key: string]: (...args: any[]) => void;
};
export default class TypedEmitter<Events extends EventList> {
    private _emitter;
    constructor();
    on<K extends keyof (Events)>(event: K, listener: (Events)[K]): this;
    once<K extends keyof (Events)>(event: K, listener: (Events)[K]): this;
    off<K extends keyof (Events)>(event: K, listener: (Events)[K]): this;
    emit<K extends keyof (Events)>(event: K, ...args: Parameters<(Events)[K]>): boolean;
    removeAllListeners<K extends keyof (Events)>(event?: K): this;
    listeners<K extends keyof (Events)>(event: K): Function[];
    listenerCount<K extends keyof (Events)>(event: K): number;
    prependListener<K extends keyof (Events)>(event: K, listener: (Events)[K]): this;
    prependOnceListener<K extends keyof (Events)>(event: K, listener: (Events)[K]): this;
    eventNames<K extends keyof (Events)>(): K[];
    getMaxListeners(): number;
}
//# sourceMappingURL=typedEmitter.d.ts.map