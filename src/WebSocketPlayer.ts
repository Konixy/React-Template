import config from './config'

interface WebSocketMessage {
    serverId?: string;
    event: string;
}

export default class WebSocketPlayer {
    ws: WebSocket;
    serverId: string;
    callback: (this: WebSocket, ev: MessageEvent<any>) => any;
    onerror: (this: WebSocket, ev: Event) => any;
    interval: NodeJS.Timer | number | undefined;
    constructor(serverId: string, callback: (this: WebSocket, ev: MessageEvent<any>) => any, onerror: (this: WebSocket, ev: Event) => any) {
        this.ws = new WebSocket(config.wsUri);
        this.serverId = serverId
        this.callback = callback
        this.onerror = onerror
        this.interval = undefined
    }
    init() {
        if(typeof this.callback !== 'function') return;
        if(typeof this.onerror !== 'function') return;
        
        this.ws.onopen = () => {
            console.log('WebSocket Server connected')
            this.ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
            this.interval = setInterval(() => {
                this.ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
            }, 900)
        }
        this.ws.onmessage = this.callback
        this.ws.onerror = this.onerror
    }
    send(msg: WebSocketMessage) {
        msg.serverId = this.serverId
        this.ws.send(JSON.stringify(msg))
    }
    destroy() {
        clearInterval(this.interval)
        this.ws.close()
    }
}