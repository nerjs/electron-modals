const path = require('path')

const EM = require('../../lib/electron_modals')

const em = new EM(null, {
    path: path.join(__dirname, 'modal.html'),
    width: 600
    // modal: true,
    // menuBar: false
})


document.getElementById('b1').addEventListener('click', () => {
    em.open()
    window.em = em
})