const { remote: { getCurrentWindow }} = require('electron')

class MessageError extends Error {
    constructor(msg, details) {
        super(msg)
        this.details = details 
        this.proccessId = getCurrentWindow().id

        this.name = 'MessageError'
    }

    toJSON() {
        return {
            message: this.message,
            processId: this.proccessId,
            name: this.name,
            details: this.details
        }
    }
}


class ArrMessagesError extends Error {
    constructor(arr) {
        if (!arr || !Array.isArray(arr) || arr.length == 0) return super('No Error message')
        const f = arr.shift()
        super(f && f.message ? f.message : 'No Error  message')

        if (f.toJSON) {
            Object.keys(f.toJSON()).forEach(key => {
                this[key] = f[key]
            })
        }
        this.name = 'ArrMessagesError'
        this.errors = [...arr]
        this.processId = process.id 
        this.name = 'ArrMessagesError'
    }


    toJSON() {
        return {
            message: this.message,
            processId: this.processId,
            name: this.name,
            errors: (this.errors ? [...this.errors] : []).filter(e => e && e instanceof Error).map(e => e.toJSON ? e.toJSON() : { name: e.name, message: e.message})
        }
    }
}


class WrapErrorFromJson extends MessageError {
    constructor(err) {
        if (!err || !err.message) return super('') 
        super(err.message)

        Object.keys(err).forEach(key => {
            this[key] = err[key]
        })

        if (this.errors && Array.isArray(this.errors)) {
            this.errors = this.errors.map(e => e instanceof Error ? e : new WrapErrorFromJson(e))
        }

        this.name = 'WrapErrorFromJson'
    }
}

exports.MessageError = MessageError
exports.ArrMessagesError = ArrMessagesError
exports.WrapErrorFromJson = WrapErrorFromJson