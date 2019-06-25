const IpcFalse = require('nerjs-utils/electron/tests/ipc_false') 
const random = require('nerjs-utils/math/random')

class TestBrowserWindow {
    constructor() {
        this.id = random(100, 200)
        this.webContents = new IpcFalse()
    }
}

module.exports = TestBrowserWindow
