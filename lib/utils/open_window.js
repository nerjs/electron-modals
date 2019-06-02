const { remote: { BrowserWindow, ipcMain }} = require('electron')
const url = require('url') 


module.exports = (template, props, t) => new Promise((resolve, reject) => {

    const win = new BrowserWindow(props)

    let tid, templateEvent;



    templateEvent = () => {
        if (tid) {
            clearInterval(tid)
            resolve(win)
        } 
        
        tid = null;
    }

    tid = setTimeout(() => {
        if (tid) reject(new Error('Callback time expired [initialize]'))
        if (win && !win.isDestroyed()) win.close()
    }, t)

    ipcMain.once(template, templateEvent)


    win.loadURL(url.format({
        protocol: 'file:',
        pathname: template, 
        slashes: true
    })) 


})