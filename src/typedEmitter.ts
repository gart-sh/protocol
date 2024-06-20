import EventEmitter from "events";

export type EventList = {
    [key: string]: (...args: any[]) => void;
}

export default class TypedEmitter<Events extends EventList> {
    private _emitter = new EventEmitter();

    constructor() { }

    // replication of EventEmitter methods for type safety
    public on<K extends keyof (Events)>(event: K, listener: (Events)[K]): this {
        this._emitter.on(event as string, listener as any);
        return this;
    }

    public once<K extends keyof (Events)>(event: K, listener: (Events)[K]): this {
        this._emitter.once(event as string, listener as any);
        return this;
    }

    public off<K extends keyof (Events)>(event: K, listener: (Events)[K]): this {
        this._emitter.off(event as string, listener as any);
        return this;
    }

    public emit<K extends keyof (Events)>(event: K, ...args: Parameters<(Events)[K]>): boolean {
        return this._emitter.emit(event as string, ...args);
    }

    public removeAllListeners<K extends keyof (Events)>(event?: K): this {
        this._emitter.removeAllListeners(event as string);
        return this;
    }

    public listeners<K extends keyof (Events)>(event: K): Function[] {
        return this._emitter.listeners(event as string);
    }

    public listenerCount<K extends keyof (Events)>(event: K): number {
        return this._emitter.listenerCount(event as string);
    }

    public prependListener<K extends keyof (Events)>(event: K, listener: (Events)[K]): this {
        this._emitter.prependListener(event as string, listener as any);
        return this;
    }

    public prependOnceListener<K extends keyof (Events)>(event: K, listener: (Events)[K]): this {
        this._emitter.prependOnceListener(event as string, listener as any);
        return this;
    }

    public eventNames<K extends keyof (Events)>(): K[] {
        return this._emitter.eventNames() as K[];
    }

    public getMaxListeners(): number {
        return this._emitter.getMaxListeners();
    }
}