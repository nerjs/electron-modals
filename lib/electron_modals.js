const { remote: { BrowserWindow, ipcMain, getCurrentWindow }} = require('electron')
const merge = require('merge')
const path = require('path')

const setOptions = require('./utils/options')
const EmProto = require('./em_proto')
const openWindow = require('./utils/open_window')
console.log(__dirname, __filename)
console.log(path.join(__dirname, 'files', 'modal_default.png'))
class ElectronModals extends EmProto {
    constructor(name, props) {
        super();

        this.options = setOptions({
            width: 400,
            height: 300,
            x: 200,
            y: 200,
            modal: false, 
            timeoutOpen: 3000,
            timeoutClose: 3000,
            icon: path.join(__dirname, 'files', 'modal_default.png'),
            winOptions: {
                resizable: true,
                movable: true, 
                closable: true,
                webPreferences: {
                }
            }
        })

        this.data = setOptions({})

        this.eventName = `__em__:${getCurrentWindow().id}`
        this.isOpen = false;
        this.isClosed = false;

        if (props && typeof props == 'object' && !Array.isArray(props)) {
            this.options(props)
        }

        this.on('message',console.log)
    } 

    async openWindow() {
        if (!this.options('path')) throw new Error('Template path is missing')
        
        const {
            width, 
            height,
            winOptions,
            modal,
            timeoutOpen
        } = this.options()

        const opt = merge.recursive({
            width, 
            height,
            // alwaysOnTop,
            // skipTaskbar, 
            // frame, 
            // minimizable: false,
            // show: false,
            // autoHideMenuBar: !menuBar,
            // type: 'desktop',
            webPreferences: {
                devTools: process.env.NODE_ENV != 'production',
                nodeIntegration: true
            }
        }, winOptions)

        if (modal) {
            opt.modal = true,
            opt.parent = getCurrentWindow()
        }


        this.win = await openWindow(this.options('path'), opt, 1000)
        return this.win
    }

    async open(data, opt) {
        await this.setWinOptions(opt)
        if (this.isOpen) {
            if (!this.win) throw new Error('isOpen == true; BrowserWindow not found')
            this.win.focus();
            await this.setData(data)
            return this;
        } 
        try {
            const win = await this.openWindow()
            this.eventName = win.id
            this.initialize(win.webContents, ipcMain, this.eventName)
            console.log(win.webContents, ipcMain, this.eventName)

            const {
                icon, 
                modal
            } = this.options()


            if (icon && !modal) win.setIcon(icon)
            win.show()
            this.isOpen = true;
            this.isClosed = false;
            this.once('closed', () => {
                this.win = null;
                this.isOpen = false;
                this.isClosed = true;
            })
            this.emit('open', win)
        } catch(e) {
            this.isClosed = true;
            this.isOpen = false
            this.emit('error', e)
            console.error(e)
            throw e;
        }
        await this.send('open', {
            options: this.options(),
            data: await this.setData(data)
        })
        return this;
    }

    async close(data) {
        if (!this.isOpen || this.isClosed || !this.win) throw new Error('Unable to close the closed window')
        
        const {
            timeoutClose
        } = this.options()

        const event = new CloseEvent('em-close', {
            cancelable: true
        })

        event.modal = this.win 

        this.emit('close', event)

        if (event.defaultPrevented) {
            this.emit('close-prevented')
            await this.send('close-prevented', {
                options: this.options(),
                data: await this.setData(data)
            })
            return this;
        }


        await this.send('close', {
            options: this.options(),
            data: await this.setData(data)
        })

        try {
            await (() => new Promise((resolve, reject) => {
                let tid;

                const closedHandler = () => {
                    if (tid) {
                        clearTimeout(tid)
                        resolve()
                    } 
                }

                this.win.once('closed', closedHandler)

                tid = setTimeout(() => {
                    if (this.isClosed || !tid) return;
                    tid = null;
                    this.win.removeListener('closed',closedHandler)
                    reject(new Error(`Failed to confirm closing the window in the allotted time [${timeoutClose}]`))
                }, timeoutClose)


                this.win.close();

            }))()
        } catch (e) {
            this.emit('close-error', e)
            this.emit('error', e)
            throw e
        }


        this.emit('closed')
        return this;
    }

    async setData(data) {
        if (!this.checkInputs(data)) return false

    }

    getData() {

    }

    async setWinOptions(opt) {
        if (!this.checkInputs(opt)) return false
    }

    checkInputs(obj) {
        if (!obj || typeof obj != 'object' || Array.isArray(obj)) return false
        if (!this.isOpen && this.isClosed) throw new Error('Window was closed')
    }

}


module.exports = ElectronModals