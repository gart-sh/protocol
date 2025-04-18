"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class TypedEmitter {
    constructor() {
        this._emitter = new events_1.default();
    }
    on(event, listener) {
        this._emitter.on(event, listener);
        return this;
    }
    once(event, listener) {
        this._emitter.once(event, listener);
        return this;
    }
    off(event, listener) {
        this._emitter.off(event, listener);
        return this;
    }
    emit(event, ...args) {
        return this._emitter.emit(event, ...args);
    }
    removeAllListeners(event) {
        this._emitter.removeAllListeners(event);
        return this;
    }
    listeners(event) {
        return this._emitter.listeners(event);
    }
    listenerCount(event) {
        return this._emitter.listenerCount(event);
    }
    prependListener(event, listener) {
        this._emitter.prependListener(event, listener);
        return this;
    }
    prependOnceListener(event, listener) {
        this._emitter.prependOnceListener(event, listener);
        return this;
    }
    eventNames() {
        return this._emitter.eventNames();
    }
    getMaxListeners() {
        return this._emitter.getMaxListeners();
    }
}
exports.default = TypedEmitter;
//# sourceMappingURL=typedEmitter.js.map