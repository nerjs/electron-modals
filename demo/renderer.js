const path = require('path')

const EM = require('../../lib/electron_modals')
const OCE = require('../../lib/close_mixin')
const constants = require('../../lib/utils/constants')

const em = new EM({
    template: path.join(__dirname, 'modal.html'),
    width: 600
    // modal: true,
    // menuBar: false
})


em.on(constants.CLOSE_PRIVATE_EVENT, (e, d) => {
    console.log('CLOSE_PRIVATE_EVENT:', constants.CLOSE_PRIVATE_EVENT)
    console.log(e)
    console.log(d)
    console.log('*******************')
})

document.getElementById('b1').addEventListener('click', async () => {
    await em.open()
    window.em = em
    window.oce = new OCE(false, 'test')
    window.oce.initialize(em.win)
})