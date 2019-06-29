
const sleep = require('nerjs-utils/core/sleep')
const { EBTEvent } = require('electron-ebt') 
const merge = require('merge')


const {
    CLOSE_PREVENTED_CURRENT_TARGET_MESS,
    CLOSE_PREVENTED_ANOTHER_TARGET_MESS, 
    CLOSE_PRIVATE_EVENT,
    CLOSE_PREVENTED_EVENT,
    CLOSE_PUBLIC_EVENT,
    CLOSE_TRANSFER_EVENT
} = require('../utils/constants')


module.exports = async function(data) {
    const event = new EBTEvent(true, data)
    if (data && typeof data == 'object') {
        event.setResult(merge({}, data))
    }
    this.emit(CLOSE_PUBLIC_EVENT, event, data) 

    if (event.isPromise()) {
        await event.getPromises();
    }

    const res = event.getResult()

    if (res.error) throw res.error 
    if (res.prevented) {
        this.emit(CLOSE_PREVENTED_EVENT, event)

        throw new Error(CLOSE_PREVENTED_CURRENT_TARGET_MESS)
    }

    try {
        const r = await this.send(CLOSE_PUBLIC_EVENT, res) 
        if (r._prevented) {
            const preventedEvent = new EBTEvent(false, r)
            this.emit(CLOSE_PREVENTED_EVENT, preventedEvent)
            throw new Error(CLOSE_PREVENTED_ANOTHER_TARGET_MESS)
        }
        try {
            await this.send(CLOSE_TRANSFER_EVENT, event, r)
        } catch(e) {}
        this.emit(CLOSE_PRIVATE_EVENT, event, r)
    } catch(e) {
        if (e.prevented) {
            this.emit(CLOSE_PREVENTED_EVENT, e)
            throw new Error(CLOSE_PREVENTED_ANOTHER_TARGET_MESS)
        } else {
            throw e
        }
    }
}