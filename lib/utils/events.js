const merge = require('merge')

const {
    EVENT_OPEN_TYPE,
    EVENT_CLOSE_TYPE,
    EVENT_MESSAGE_TYPE
} = require('./constants')

const { ArrMessagesError, MessageError } = require('./errors')


const getOpt = o => merge({
    cancelable: true
}, o && typeof o == 'object' && !Array.isArray(o) ? o : {})

class EMEvent extends CustomEvent {
    constructor(name, type, currentWin, targetWin, opt) {
        super(type, getOpt(opt))
        this.currentWin = currentWin;
        this.targetWin = targetWin;

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
    constructor(c, t) {
        super('EMOpenEvent', EVENT_OPEN_TYPE, c, t)
    }
}


class EMCloseEvent extends EMEvent {
    constructor(c, t) {
        super('EMCloseEvent', EVENT_CLOSE_TYPE, c, t)
    }
}

class EMMessageEvent extends EMEvent {
    constructor(c, t) {
        super('EMMessageEvent', EVENT_MESSAGE_TYPE, c, t, {
            cancelable: false
        })
        
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
        return new ArrMessagesError(this.resultErrors)
    }

    composeResultPromises() {
        if (this.resultValues.length == 0) return Promise.resolve()
        return Promise.all(this.resultPromises)
    }


    setResult(r) {
        if (this.closed) return console.error(new Error('Event is closed'))
        if (r instanceof Error) {
            this.resultErrors.push(r)
        } else if (r instanceof Promise) {
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

    async getResult(cb) {
        switch (this.getStatus()) {
            case 0: return this.composeResultErrors()
            case 2: throw this.composeResultValues()
            case 1:
                if (cb) cb(this.getStatus())
                await this.composeResultPromises()
                return this.composeResultValues()
            default: return null;
        }
    }
}


exports.EMOpenEvent = EMOpenEvent
exports.EMCloseEvent = EMCloseEvent
exports.EMMessageEvent = EMMessageEvent
