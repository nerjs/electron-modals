const { app, BrowserWindow, globalShortcut } = require('electron')

const dtRegister = win => () => {
    if (!win.isFocused()) return;
    if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
    } else {
        win.webContents.openDevTools()
    }
}

module.exports = win => {
    win.on('focus', () => {
        globalShortcut.register('F12', dtRegister(win))
    })
    win.on('blur', () => {
        globalShortcut.unregister('F12')
    })
}
