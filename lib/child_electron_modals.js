const { ipcRenderer } = require('electron')

const setOptions = require('./utils/options')
const EmProto = require('./em_proto')

class ChildElectronModals extends EmProto {
    constructor() {
        super()
        ipcRenderer.send(window.location.pathname)
    }
}

module.exports = new ChildElectronModals()
