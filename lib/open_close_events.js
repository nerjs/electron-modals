const { EMOpenEvent, EMCloseEvent } = require('./utils/events')
const { 
    PREFIX,
    EVENT_CLOSE_COMMAND, 
    EVENT_CLOSE, 
    EVENT_CLOSED, 
    EVENT_PRE_CLOSED, 
    EVENT_CLOSE_PREVENTED 
} = require('./utils/constants')
const EMProto = require('./em_proto')


const _onCloseCommand = async () => {
    const event = new EMCloseEvent(true)
    this.emit(EVENT_CLOSE, event)
    if (event.defaultPrevented) {
        this.emit(EVENT_CLOSE_PREVENTED)
    } else {
        const res = await this.send(EVENT_CLOSE)
        if (res && res.defaultPrevented) {
            this.emit(EVENT_CLOSE_PREVENTED)
        } else {
            this.emit(EVENT_PRE_CLOSED)
            await this.send(EVENT_PRE_CLOSED)
        }
    }
}

const _onClose = async () => {
    const event = new EMCloseEvent(false)
    this.emit(EVENT_CLOSE, event)
    if (event.defaultPrevented) {
        this.emit(EVENT_CLOSE_PREVENTED)
        await this.send(EVENT_CLOSE_PREVENTED)
    } else {
        this.emit(EVENT_PRE_CLOSED)
    }
}

class OCEvents extends EMProto {
    initialize(ipcSender, ipcListener, eventName='', isModal) {
        super.initialize(ipcSender, ipcListener, eventName)

        const onCloseCommand = _onCloseCommand.bind(this)
        const onClose = _onClose.bind(this)

        this.on(EVENT_CLOSE_COMMAND, onCloseCommand)
        this.on(`${PREFIX}:${EVENT_CLOSE}`, onClose)


        this.once(EVENT_PRE_CLOSED, () => {
            super.reinitialize()
            this.removeListener(EVENT_CLOSE_COMMAND, onCloseCommand)
            this.removeListener(`${PREFIX}:${EVENT_CLOSE}`, onClose)
        })

        if (isModal) {
            this.initialBeforeUnload()
        }
    }

    initialBeforeUnload() {
        
    }

    // reinitialize() {
    // }

    

    

}


module.exports = OCEvents
