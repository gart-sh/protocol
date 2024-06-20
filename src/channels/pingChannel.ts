import CallbackChannel from "../callbackChannel"

export const PingChannel = new CallbackChannel<{
    'ping': {
        request: {
            message: string
        },
        response: {
            message: string
        }
    }
}>("ping")