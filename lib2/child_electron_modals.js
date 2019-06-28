const { ipcRenderer, remote: { BrowserWindow, ipcMain, getCurrentWindow } } = require('electron')

const setOptions = require('./utils/options')
const EmProto = require('./em_proto')

class ChildElectronModals extends EmProto {
    constructor() {
        super()
        ipcRenderer.send(window.location.pathname)
        this.initialize(ipcRenderer, ipcRenderer, getCurrentWindow().id)
    }
}
// window.addEventListener('beforeunload', e => e.returnValue = 1)
module.exports = new ChildElectronModals()
