const { ipcRenderer } = require('electron')
const ipcMain = require('nerjs-utils/electron/ipc_main')
const merge = require('merge')
const closeFn = require('./privates/close_fn_mixin')
const DataMixin = require('./data_mixin')

const {
    IS_MODAL_PROPS,
    IS_START_CLOSED_PROPS,
    DEFAULT_EVENT_NAME_PROPS,
    WIN_UNDEFINED_MESS,
    WEB_CONTENTS_UNDEFINED_MESS,
    CLOSE_IN_PROGRESS_MESS, 
    CLOSE_BEFORE_OPEN_MESS,
    TIMEOUT_WAIT_CB, 
    TIMEOUT_WAIT_CB_LONG,
    CLOSED_PUBLIC_EVENT,
    CLOSE_PRIVATE_EVENT,
    CLOSE_TRANSFER_EVENT
} = require('./utils/constants')



/**
 * Open-Close-Events 
 * 
 * main.emit([Symbol(open)])
 */
class CloseMixin extends DataMixin {
    constructor(isModal, name, timerOptions={}) {
        super();

        this[IS_MODAL_PROPS] = !!isModal
        this[IS_START_CLOSED_PROPS] = false
        this[DEFAULT_EVENT_NAME_PROPS] = name;

        this.senderOptions = merge.recursive({}, {
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG
        }, timerOptions)

        this.on(CLOSE_TRANSFER_EVENT, event => {
            if (!event.initiator) {
                setTimeout(() => {
                    this.emit(CLOSE_PRIVATE_EVENT, event)
                })
            }
        })
    }

    get isModal() {
        return this[IS_MODAL_PROPS]
    }


    get isStartClosed() {
        return !!this[IS_START_CLOSED_PROPS]
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

        super.initialize({ sender, listener, name }, this.senderOptions) 

    }



    async close() {
        if (this.isStartClosed) throw new Error(CLOSE_IN_PROGRESS_MESS)
        if (!this.ipcSender) throw new Error(CLOSE_BEFORE_OPEN_MESS)
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
