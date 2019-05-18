const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const url = require('url')

const devTools = require('./dev_tools')

const templates = path.join(__dirname, 'templates')
const icons = path.join(__dirname, 'icons')

const mainTemplate = path.join(templates, 'main.html')
const mainIcon = path.join(icons, 'main.png')





app.on('window-all-closed', () => {
    app.quit()
  })


let win = null;

app.on('ready', () => {
    console.log('Ready main process')
    win = new BrowserWindow({
        width: 800,
        height: 500,
        show: false,
        fullscreenWindowTitle: true,
        // autoHideMenuBar: true, 
        icon: mainIcon, 
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    })
    

    win.loadURL(url.format({
        protocol: 'file:',
        pathname: mainTemplate, 
        slashes: true
    })) 

    devTools(win)




    win.once('close', () => {
        win = null
    })

    win.once('ready-to-show', () => {
        console.log('ready-to-show')
        win.show()
        win.maximize()
    })

    win.on('error', console.log)
})