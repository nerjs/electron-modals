const path = require('path')
const CloseMixin = require('./close_mixin')
const openWin = require('nerjs-utils/electron/open_win')
const { defWinProps } = require('./utils/default_props')
const setOptions = require('./utils/options')
const merge = require('merge')
const getPosition = require('./utils/pisition')

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
            position: {
                width: 400,
                height: 300,
                center: true
            },
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG,
            timeoutOpenWin: TIMEOUT_OPEN_WIN,
            winOptions: defWinProps()
        })
        options(props)
        
        const {
            confirmTimeout, 
            waitConfirmTimeout
        } = options

        super(false, name, { confirmTimeout, waitConfirmTimeout })

        this.options = options
        this.data = setOptions({})

        this[IS_OPEN_PROPS] = false
        this[IS_OPEN_IN_PROGRESS_PROPS] = false
        this[IS_CLOSED_PROPS] = false
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
                                { icon }, 
                                winOptions, 
                                winProps, 
                                { show: false }, 
                                getPosition(merge({}, 
                                                position, 
                                                curPosition
                                                )
                                            )
                                )
        
        this[IS_OPEN_IN_PROGRESS_PROPS] = true

        this.win = await openWin(template, p, timeoutOpenWin)
        
        this.initialize(this.win, this[DEFAULT_EVENT_NAME_PROPS] || `em:${this.win.id}`)

        await this.setData(data)

        this.win.show()

        this.emit('open', this.win)

        this[IS_OPEN_IN_PROGRESS_PROPS] = false
        this[IS_OPEN_PROPS] = true

        this.setCloseEvents()
    }

    setCloseEvents() {

    }

    async setData() {

    }
}

ElectronModal.defWinProps = defWinProps


module.exports = ElectronModal
