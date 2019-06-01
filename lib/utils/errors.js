const { remote: { getCurrentWindow }} = require('electron')

class MessageError extends Error {
    constructor(msg, details) {
        super(msg)
        this.details = details
    }
    processId = getCurrentWindow().id

    name = 'MessageError'

    toJSON() {
        return {
            message: this.message,
            processId: this.processId,
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
    }
    processId = process.id

    name = 'ArrMessagesError'

    toJSON() {
        return {
            message: this.message,
            processId: this.processId,
            name: this.name,
            errors: (this.errors ? [...this.errors] : []).filter(e => e && e instanceof Error).map(e => e.toJSON ? e.toJSON() : e)
        }
    }
}

exports.MessageError = MessageError
exports.ArrMessagesError = ArrMessagesError