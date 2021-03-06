


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
} = require('../utils/constants')





module.exports = function() {

    const closeHandler = event => {
        if (!this.win) return console.error(new Error('Win not found'))
        this.win.destroy()
        this.reinitialize()
        this[IS_CLOSED_PROPS] = true
        this[IS_OPEN_PROPS] = false

        this.emit('closed', event)
    }


    this.on('initialize', () => {
        this.on(CLOSE_PRIVATE_EVENT, closeHandler)
    })

    this.on('reinitialize', () => {
        this.removeListener(CLOSE_PRIVATE_EVENT, closeHandler)
    })

}