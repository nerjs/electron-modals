const { remote: { BrowserWindow, ipcMain }} = require('electron')

const setOptions = require('./utils/options')
const EmProto = require('./em_proto')
const openWindow = require('./utils/open_window')

class ElectronModals extends EmProto {
    constructor(name, props) {
        super();

        this.options = setOptions({
            width: 400,
            height: 300,
            x: 200,
            y: 200,
            autoResize: false,
            maxWidth: 400,
            maxHeight: 300,
            menuBar: true,
            modal: false
        })

        this.eventName = `__em__:${name}`


        if (props && typeof props == 'object' && !Array.isArray(props)) {
            this.options(props)
        }
    } 

    async openWindow() {
        if (!this.options('path')) throw new Error('Template path is missing')
        const {
            width, 
            height
        } = this.options()
        this.win = await openWindow(this.options('path'), {
            width, 
            height,
            webPreferences: {
                devTools: true,
                nodeIntegration: true
            }
        }, 1000)

    }
}


module.exports = ElectronModals