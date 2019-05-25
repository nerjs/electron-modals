const EventEmitter = require('events');

const merge = require('merge');


class EmProto extends EventEmitter {
    constructor() {
        super()
    }

    initialize(ipcSender, ipcListener, eventNameSender='', eventNameListener='') {
        this.__cbCounts = 0 
        this.cbTimeout = this.cbTimeout || 1000
        this.ipcSender = ipcSender 
        this.ipcListener = ipcListener
        this.eventNameSender = eventNameSender;
        this.eventNameListener = eventNameListener;
        this.__messageCb = (event, data) => this.parseEvent(event, data)
        this.ipcListener.on(eventNameListener, this.__messageCb) 
        this.emit('initialize')
    }

    reinitialize() {
        if (!this.ipcListener) return;
        this.ipcListener.removeListener(this.__messageCb)
        this.ipcListener = null;
        this.ipcSender = null; 
        this.emit('reinitialize')
    }

    parseEvent(event, _data) {
        this.emit('message', _data)
        const data = merge({ name: 'null'}, _data) 
        
        if (data.cb && typeof data.cb == 'string') {
            this.ipcSender.send(data.cb)
        }
        this.emit(data.name, data.result)
    }

    send(name, data) {
        return new Promise((resolve, reject) => {
            this.__cbCounts++;
            const eventCb = `${this.eventNameListener}:${this.__cbCounts}:${Math.random()}`
            let tid = null
            const cbHandler = () => {
                if (tid) clearTimeout(tid)
                resolve()
            }

            tid = setTimeout(() => {
                if (!tid) return
                this.ipcSender.removeListener(eventCb, cbHandler)
                reject(new Error(`Callback time expired [${eventCb}]`)) 
                tid = null
            }, this.cbTimeout)

            this.ipcListener.once(eventCb, cbHandler)
            this.ipcSender.send(this.eventNameSender, {
                name: name || 'null', 
                cb: eventCb, 
                result: data
            })
        })
    }

}


module.exports = EmProto