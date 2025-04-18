export declare enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2,
    DEBUG = 3
}
export default class GlobalLogger {
    static init(options?: {
        consoleLogLevel?: LogLevel;
        debugEnabled?: boolean;
        colorEnabled?: boolean;
        ignoreMethods?: string[];
    }): void;
    static debug(method: string, ...message: any[]): void;
    static log(method: string, ...message: any[]): void;
    static warn(method: string, ...message: any[]): void;
    static error(method: string, ...message: any[]): void;
    static info: (method: string, ...message: any[]) => void;
    static getColor(str: string): string;
}
export declare class Logger {
    readonly method: string;
    constructor(method: string);
    debug(...message: any[]): void;
    log(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
    info(...message: any[]): void;
    static create(method: string): Logger;
}
//# sourceMappingURL=logger.d.ts.map