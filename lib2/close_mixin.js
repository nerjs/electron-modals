const EBT = require('electron-ebt')
const { ipcRenderer } = require('electron')
const ipcMain = require('nerjs-utils/electron/ipc_main')
const sleep = require('nerjs-utils/core/sleep')
const merge = require('merge')

const { EBTEvent } = EBT

const {
    IS_MODAL_PROPS,
    IS_START_CLOSED_PROPS,
    DEFAULT_EVENT_NAME_PROPS,
    WIN_UNDEFINED_MESS,
    WEB_CONTENTS_UNDEFINED_MESS,
    CLOSE_PREVENTED_CURRENT_TARGET_MESS,
    CLOSE_PREVENTED_ANOTHER_TARGET_MESS, 
    CLOSE_IN_PROGRESS_MESS,
    CLOSE_PRIVATE_EVENT,
    CLOSE_PREVENTED_EVENT,
    CLOSE_PUBLIC_EVENT,
    CLOSED_PUBLIC_EVENT,
    TIMEOUT_WAIT_CB, 
    TIMEOUT_WAIT_CB_LONG
} = require('./utils/constants')


const closeFn = async function(data) {
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
            await this.send(CLOSED_PUBLIC_EVENT, event, r)
        } catch(e) {}
        this.emit(CLOSE_PRIVATE_EVENT, event, r)
        await sleep(10)
        this.emit(CLOSED_PUBLIC_EVENT, event, r)
    } catch(e) {
        if (e.prevented) {
            this.emit(CLOSE_PREVENTED_EVENT, e)
            throw new Error(CLOSE_PREVENTED_ANOTHER_TARGET_MESS)
        } else {
            throw e
        }
    }
}

/**
 * Open-Close-Events 
 * 
 * main.emit([Symbol(open)])
 */
class CloseMixin extends EBT {
    constructor(isModal, name, timerOptions={}) {
        super();

        this[IS_MODAL_PROPS] = !!isModal
        this[IS_START_CLOSED_PROPS] = false
        this[DEFAULT_EVENT_NAME_PROPS] = name;

        this.timerOptions = merge.recursive({}, {
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG
        }, timerOptions)
    }

    get isModal() {
        return this[IS_MODAL_PROPS]
    }


    get isStartClosed() {
        return this[IS_START_CLOSED_PROPS]
    }


    initialize(win, _name) {
        let sender, listener, name;

        if (this.isModal) {
            name = win && typeof win == 'string' ? win : this[DEFAULT_EVENT_NAME_PROPS]
            sender = ipcRenderer
            listener = ipcRenderer
        } else {
            name = _name && typeof _name == 'string' ? _name : this[DEFAULT_EVENT_NAME_PROPS]
            if (!win || typeof win !== 'object') throw new Error(WIN_UNDEFINED_MESS)
            if (!win.webContents || 
                typeof win.webContents !== 'object' || 
                !win.webContents.send || 
                typeof win.webContents.send !== 'function') throw new Error(WEB_CONTENTS_UNDEFINED_MESS)
            sender = win.webContents;
            listener = ipcMain
        }

        super.initialize({ sender, listener, name }, this.timerOptions) 

    }



    async close() {
        if (this.isStartClosed) throw new Error(CLOSE_IN_PROGRESS_MESS)
        this[IS_START_CLOSED_PROPS] = true;

        try {
            const res = await closeFn.apply(this, arguments)
            this[IS_START_CLOSED_PROPS] = false;
            return res
        } catch(e) {
            this[IS_START_CLOSED_PROPS] = false;
            throw e
        }

    }

}


module.exports = CloseMixin
