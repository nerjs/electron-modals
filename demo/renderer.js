const { remote: { BrowserWindow, ipcMain }} = require('electron')
const url = require('url') 
const path = require('path')
const btns = document.getElementsByClassName('btn') 



const icons = path.join(__dirname, '..', 'icons')

const mainTemplate = path.join(__dirname, 'modal.html')
const mainIcon = path.join(icons, 'main.png')

console.log(btns)
let win = null
for (let i = 0; i < btns.length; i++) {
    console.log(btns[i])
    btns[i].addEventListener('click', () => {
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
    
        // devTools(win)
    
    
        win.webContents.on('test', () => {
            console.log('*****************')
        })
        ipcMain.on('test', (a,b) => {
            console.log('lllllllllllllllllllll')
            console.log(a, b)
        })
    
        win.once('close', () => {
            win = null
        })
    
        win.once('ready-to-show', () => {
            console.log('ready-to-show')
            win.show()
            // win.maximize()
        })
    
        win.on('error', console.log)

    })
}