const options = require('./options')


exports.defWinProps = options({
    width: 400,
    height: 300,
    center: true, 
    title: 'Electron modal',
    icon: path.join(__dirname, '..', 'files', 'modal_default.png'), 
    show: false,
    resizable: true,
    movable: true, 
    closable: true,
    webPreferences: {
        devTools: process.env.NODE_ENV != 'production',
        nodeIntegration: true
    }
})