import config from './config'

export default class WebSocketPlayer {
    constructor(serverId, callback, onerror) {
        this.ws = new WebSocket(config.wsUri);
        this.serverId = serverId
        this.callback = callback
        this.onerror = onerror
        this.interval = null
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
    send(msg) {
        msg.serverId = this.serverId
        this.ws.send(JSON.stringify(msg))
    }
    destroy() {
        clearInterval(this.interval)
        this.ws.close()
    }
}