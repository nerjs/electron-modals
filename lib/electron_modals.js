const path = require('path')
const { remote: { getCurrentWindow }} = require('electron')
const merge = require('merge')
const openWin = require('nerjs-utils/electron/open_win')

const CloseMixin = require('./close_mixin')
const { defWinProps } = require('./utils/default_props')
const setOptions = require('./utils/options')
const getPosition = require('./utils/pisition')
const setCloseEvents = require('./privates/set_close_events')




const {
    INITIAL_DATA_EVENT,
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

class ElectronModal extends CloseMixin {
    constructor(name, props) {
        if (typeof name != 'string') {
            props = name
            name = null
        }

        if (typeof props != 'object' || Array.isArray(props)) {
            props = {}
        }

        const options = setOptions({
            modal: false,
            icon: path.join(__dirname, 'files', 'modal_default.png'), 
            template: null, 
            position: {},
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG,
            timeoutOpenWin: TIMEOUT_OPEN_WIN,
            winOptions: defWinProps()
        })
        options(props)
        
        const {
            confirmTimeout, 
            waitConfirmTimeout
        } = options()

        super(false, name, { confirmTimeout, waitConfirmTimeout })

        this.options = options
        this.data = setOptions({})

        this[IS_OPEN_PROPS] = false
        this[IS_OPEN_IN_PROGRESS_PROPS] = false
        this[IS_CLOSED_PROPS] = false 


        setCloseEvents.apply(this)
    }

    get isOpen() {
        return !!this[IS_OPEN_PROPS]
    }

    get isOpenInProgress() {
        return !!this[IS_OPEN_IN_PROGRESS_PROPS]
    }

    get isClosed() {
        return !!this[IS_CLOSED_PROPS]
    }


    async open(template, curPosition, data, winProps) {
        if (this.isOpen || this.isOpenInProgress) throw new Error(WIN_IS_OPEN_MESS)

        if (typeof template != 'string') {
            winProps = data 
            data = curPosition 
            curPosition = template 
            template = this.options('template') || null
        }

        if (!winProps || typeof winProps != 'object') {
            winProps = {}
        }

        if (!data || typeof data != 'object') {
            data = {}
        }

        if (!curPosition || typeof curPosition != 'object') {
            curPosition = {}
        }

        if (!template) throw new Error(TEMPLATE_IS_REQUIRED_MESS) 

        const {
            icon,
            modal, 
            position,
            timeoutOpenWin,
            winOptions
        } = this.options()


        const p = merge.recursive({}, 
                                winOptions, 
                                { icon }, 
                                winProps, 
                                { show: false }, 
                                getPosition(merge({}, position, curPosition)))
        

        if (modal) {
            p.modal = true 
            p.parent = getCurrentWindow()
        }

        this[IS_OPEN_IN_PROGRESS_PROPS] = true
        

        try {
            this.win = await openWin(template, p, timeoutOpenWin)  
            
            this.initialize(this.win, this[DEFAULT_EVENT_NAME_PROPS] || `em:${this.win.id}`)


            this.win.show()
            
            this.data(data)
            
            await this.send('open', this.data())

        } catch(e) {
            this[IS_OPEN_IN_PROGRESS_PROPS] = false
            this[IS_OPEN_PROPS] = true

            throw e
        }

        this.emit('open', this.win)

        this[IS_OPEN_IN_PROGRESS_PROPS] = false
        this[IS_OPEN_PROPS] = true

    }


    async setData() {

    }
}

ElectronModal.defWinProps = defWinProps


module.exports = ElectronModal
