"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["INFO"] = 0] = "INFO";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const GLOAL_LOG_SETTINGS = {
    consoleLogLevel: LogLevel.INFO,
    debugEnabled: process.env.DEBUG === "true" || process.env.DEBUG_LOGS === "true",
    ignoreMethods: []
};
class GlobalLogger {
    static init(options) {
        GLOAL_LOG_SETTINGS.consoleLogLevel = options?.consoleLogLevel ?? GLOAL_LOG_SETTINGS.consoleLogLevel;
        GLOAL_LOG_SETTINGS.debugEnabled = options?.debugEnabled ?? GLOAL_LOG_SETTINGS.debugEnabled;
        GLOAL_LOG_SETTINGS.ignoreMethods = options?.ignoreMethods ?? GLOAL_LOG_SETTINGS.ignoreMethods;
        if (GLOAL_LOG_SETTINGS.debugEnabled) {
            console.log(chalk_1.default.blue.bold("[DEBUG] ") + chalk_1.default.blue("Debug mode enabled"));
        }
    }
    static debug(method, ...message) {
        if (GLOAL_LOG_SETTINGS.debugEnabled && !GLOAL_LOG_SETTINGS.ignoreMethods.includes(method)) {
            const col = GlobalLogger.getColor(method);
            console.log(chalk_1.default.blue.bold(`[DEBUG]`) + chalk_1.default.hex(col).bold(`[${method}] `) + chalk_1.default.blue(`${message.join("\n")}`));
        }
    }
    static log(method, ...message) {
        const col = GlobalLogger.getColor(method);
        if (GLOAL_LOG_SETTINGS.consoleLogLevel === 0 && !GLOAL_LOG_SETTINGS.ignoreMethods.includes(method))
            console.log(chalk_1.default.hex(col).bold(`[${method}] `) + chalk_1.default.green(`${message.join("\n")}`));
    }
    static warn(method, ...message) {
        const col = GlobalLogger.getColor(method);
        if (GLOAL_LOG_SETTINGS.consoleLogLevel <= 1 && !GLOAL_LOG_SETTINGS.ignoreMethods.includes(method))
            console.warn(chalk_1.default.hex(col).bold(`[${method}] `) + chalk_1.default.yellow(`${message.join("\n")}`));
    }
    static error(method, ...message) {
        const col = GlobalLogger.getColor(method);
        if (GLOAL_LOG_SETTINGS.consoleLogLevel <= 2 && !GLOAL_LOG_SETTINGS.ignoreMethods.includes(method))
            console.error(chalk_1.default.hex(col).bold(`[${method}] `) + chalk_1.default.red(`${message.join("\n")}`));
    }
    static getColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += ("00" + value.toString(16)).substr(-2);
        }
        return color;
    }
}
GlobalLogger.info = (method, ...message) => GlobalLogger.log(method, ...message);
exports.default = GlobalLogger;
class Logger {
    constructor(method) {
        this.method = method;
    }
    debug(...message) {
        GlobalLogger.debug(this.method, ...message);
    }
    log(...message) {
        GlobalLogger.log(this.method, ...message);
    }
    warn(...message) {
        GlobalLogger.warn(this.method, ...message);
    }
    error(...message) {
        GlobalLogger.error(this.method, ...message);
    }
    info(...message) {
        GlobalLogger.info(this.method, ...message);
    }
    static create(method) {
        return new Logger(method);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map