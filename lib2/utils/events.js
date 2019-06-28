const merge = require('merge')
const CustomEvent = require('nerjs-utils/electron/custom_event')

const {
    TYPE_EVENT_OPEN,
    TYPE_EVENT_CLOSE,
    TYPE_EVENT_MESSAGE
} = require('./constants')

const { ArrMessagesError, MessageError } = require('./errors')


const getOpt = o => merge({
    cancelable: true
}, o && typeof o == 'object' && !Array.isArray(o) ? o : {})

class EMEvent extends CustomEvent {
    constructor(name, type, opt) {
        super(type, getOpt(opt))
        

        try {
            Object.defineProperty(this, Symbol.toStringTag, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: name
            });
        } catch(e) {}

    }
}


class EMOpenEvent extends EMEvent {
    constructor(data, target) {
        super('EMOpenEvent', TYPE_EVENT_OPEN)
        this.data = data
        this.target = target 
        this.eventName = eventName
    }
}


class EMCloseEvent extends EMEvent {
    constructor(isInitiator) {
        super('EMCloseEvent', TYPE_EVENT_CLOSE)
        this.isInitiator = isInitiator
    }
}

class EMMessageEvent extends EMEvent {
    constructor(ipcEventName, data, ipcCbName) {
        super('EMMessageEvent', TYPE_EVENT_MESSAGE, {
            cancelable: false
        })

        this.data = data
        this.ipcEventName = ipcEventName
        this.ipcCbName = ipcCbName

        this.__resId = 0;
        
        this.resultValues = []
        this.resultErrors = []
        this.resultPromises = []
    }

    isSuccess() {
        return this.resultErrors.length == 0;
    }

    getStatus() {
        return this.resultPromises.length > 0 ? 1 : (this.resultErrors.length > 0 ? 0 : 2)
    }

    composeResultValues() {
        if (this.resultValues.length == 0) return {};
        return merge.recursive(...this.resultValues)
    }

    composeResultErrors() {
        if (this.resultErrors.length == 0) return null;
        return (new ArrMessagesError(this.resultErrors)).toJSON()
    }

    composeResultPromises() {
        if (this.resultValues.length == 0) return Promise.resolve()
        return Promise.all(this.resultPromises)
    }


    setResult(r) {
        this.__resId++;

        if (this.closed) return console.error(new Error('Event is closed'))
        if (r instanceof Error) {
            this.resultErrors.push(r)
        } else if (r instanceof Promise) {
            r.__id = this.__resId
            const clearPrRow = () => {
                this.resultPromises = this.resultPromises.filter(pr => pr !== r && pr.__id !== r.__id)
            }
            r.finally(clearPrRow)

            this.resultPromises.push(r)
        } else {
            this.resultValues.push(r)
        }
    }

    end() {
        this.closed = true;
        ['resultValues', 'resultErrors', 'resultPromises'].forEach(key => {
            this[key] = null
        })
    }

    _getResult() {
        return {
            error: this.composeResultErrors(),
            result: this.composeResultValues()
        }
    }

    async getResult(cb) {
        if (this.getStatus() == 1) {
            if (cb && typeof cb == 'function') cb(this.getStatus())
            await this.composeResultPromises()
        }

        return this._getResult()
    }
}


exports.EMOpenEvent = EMOpenEvent
exports.EMCloseEvent = EMCloseEvent
exports.EMMessageEvent = EMMessageEvent
