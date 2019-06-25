const path = require('path')

const EM = require('../../lib/electron_modals')
const OCE = require('../../lib/close_mixin')
const constants = require('../../lib/utils/constants')

const em = new EM(null, {
    path: path.join(__dirname, 'modal.html'),
    width: 600
    // modal: true,
    // menuBar: false
})


document.getElementById('b1').addEventListener('click', async () => {
    await em.open()
    window.em = em
    window.oce = new OCE(false, 'test')
    window.oce.initialize(em.win)
})