const EventEmitter = require('events');
const merge = require('merge');

const {
    PREFIX,
    IPC_EVENT_NAME,
    TIMEOUT_WAIT_CB, 
    TIMEOUT_WAIT_CB_LONG
} = require('./utils/constants')
const { WrapErrorFromJson } = require('./utils/errors')
const { EMMessageEvent } = require('./utils/events')


class EmProto extends EventEmitter {
    constructor() {
        super()
    }

    initialize(ipcSender, ipcListener, eventName='') {
        this.__cbCounts = 0 
        this.cbTimeout = this.cbTimeout || 1000
        this.ipcSender = ipcSender 
        this.ipcListener = ipcListener
        this.eventName = `${IPC_EVENT_NAME}:${eventName}`
        this.__messageCb = (event, data) => this.parseEvent(event, data)
        this.ipcListener.on(this.eventName, this.__messageCb) 
        this.emit('initialize')
    }

    reinitialize() {
        if (!this.ipcListener) return;
        this.ipcListener.removeListener(this.__messageCb)
        this.ipcListener = null;
        this.ipcSender = null; 
        this.emit('reinitialize')
    }

    parseEvent(e, _data) {
        this.emit('message', _data)
        const __data = merge({ name: 'null'}, _data), 
            name = __data.name || 'null',
            cb = __data.cb || `cb:${Math.random()}`,
            data = __data.data || {};
        
        const event = new EMMessageEvent(name, data, cb)

        this.emit(`${PREFIX}:${name}`, data, event)

        event.getResult(() => {
            this.ipcSender.send(`${cb}:wait`)
        }).then(res => {
            this.ipcSender.send(cb, res)
        })
        
    }

    send(name, data) {
        return new Promise((resolve, reject) => {
            this.__cbCounts++;
            const eventCb = `${this.eventName}:${this.__cbCounts}:${Math.random()}`
            const eventCbWait = `${eventCb}:wait`
            let tid, cbHandler, cbHandlerWait, timeOutHandler;

            timeOutHandler = () => {
                if (!tid) return;
                tid = null;
                this.ipcListener.removeListener(eventCbWait, cbHandlerWait)
                this.ipcListener.removeListener(eventCb, cbHandler)
                reject(new Error(`Callback time expired [${eventCb}] [${name}]`)) 
            }

            cbHandler = (event, _resData={}) => {
                const resData = merge({ error: null, result: null }, _resData)
                if (!tid) return;
                clearTimeout(tid)
                this.ipcListener.removeListener(eventCbWait, cbHandlerWait)
                if (resData.error) {
                    reject(new WrapErrorFromJson(resData.error))
                } else {
                    resolve(resData.result)
                }
            }

            cbHandlerWait = () => {
                if (!tid) return;
                clearTimeout(tid)
                tid = setTimeout(timeOutHandler, TIMEOUT_WAIT_CB_LONG)
            }

            tid = setTimeout(timeOutHandler, TIMEOUT_WAIT_CB)
            this.ipcListener.once(eventCb, cbHandler)
            this.ipcListener.once(eventCbWait, cbHandlerWait)
            this.ipcSender.send(this.eventName, {
                name: name || 'null', 
                cb: eventCb, 
                data: data,
                sender: this.eventName
            })
        })
    }

}


module.exports = EmProto