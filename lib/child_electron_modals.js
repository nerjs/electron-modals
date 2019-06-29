const { ipcRenderer, remote: { BrowserWindow, ipcMain, getCurrentWindow } } = require('electron')

const setOptions = require('./utils/options')
const CloseMixin = require('./close_mixin')



const {
    IS_OPEN_PROPS,    // PROPS NAMES 
    IS_OPEN_IN_PROGRESS_PROPS,
    IS_CLOSED_PROPS,
    IS_MODAL_PROPS,
    IS_START_CLOSED_PROPS,    // MESSAGES 
    DEFAULT_EVENT_NAME_PROPS,
    WIN_UNDEFINED_MESS,
    WEB_CONTENTS_UNDEFINED_MESS,
    CLOSE_PREVENTED_CURRENT_TARGET_MESS,
    CLOSE_PREVENTED_ANOTHER_TARGET_MESS, 
    CLOSE_IN_PROGRESS_MESS,
    WIN_IS_OPEN_MESS,
    TEMPLATE_IS_REQUIRED_MESS,
    CLOSE_PRIVATE_EVENT,    // EVENTS 
    CLOSE_PREVENTED_EVENT,
    CLOSE_PUBLIC_EVENT,
    CLOSED_PUBLIC_EVENT, 
    TIMEOUT_WAIT_CB,    // TIMERS 
    TIMEOUT_WAIT_CB_LONG,
    TIMEOUT_OPEN_WIN
} = require('./utils/constants')


class ChildElectronModals extends CloseMixin {
    constructor(name, props) {
        if (typeof name != 'string') {
            props = name
            name = null
        }

        if (typeof props != 'object' || Array.isArray(props)) {
            props = {}
        }

        const options = setOptions({
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG,
        })


        options(props)


        const {
            confirmTimeout, 
            waitConfirmTimeout
        } = options

        super(true, name, { confirmTimeout, waitConfirmTimeout })

        this.options = options 
        this.data = setOptions({})

        this.initialize(name || `em:${getCurrentWindow().id}`)
    }
}


module.exports = ChildElectronModals
