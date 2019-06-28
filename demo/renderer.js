const path = require('path')

const EM = require('../../lib2/electron_modals')
const OCE = require('../../lib/close_mixin')
const constants = require('../../lib/utils/constants')

const em = new EM({
    template: path.join(__dirname, 'modal.html'),
    width: 600
    // modal: true,
    // menuBar: false
})

console.log(em.options())

document.getElementById('b1').addEventListener('click', async () => {
    await em.open()
    window.em = em
    window.oce = new OCE(false, 'test')
    window.oce.initialize(em.win)
})