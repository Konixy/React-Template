import config from './config'

export default class WebSocketPlayer {
    constructor(serverId, callback) {
        this.ws = new WebSocket(config.wsUri);
        this.serverId = serverId
        this.callback = callback
    }
    init() {
        if(typeof this.callback !== 'function') return;
        this.ws.onopen = () => {
            console.log('WebSocket Server connected')
            this.ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
            setInterval(() => {
                this.ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
            }, 900)
          }
          this.ws.onmessage = this.callback
    }
    send(msg) {
        msg.serverId = this.serverId
        this.ws.send(JSON.stringify(msg))
    }
}