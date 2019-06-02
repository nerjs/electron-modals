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

module.exports = new ChildElectronModals()
