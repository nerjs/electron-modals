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

// const fs = require('fs') 


// const writef = name => {
//     fs.writeFile(path.join(__dirname, 'z', `${name}.txt`), Date.now(), e => {
//         if (e) alert(e.message)
//     }) 
// }

// const getWrite = name => () => writef(name)


// em.on(constants.CLOSE_PRIVATE_EVENT, getWrite('parent_CLOSE_PRIVATE_EVENT'))
// em.on(constants.CLOSE_TRANSFER_EVENT, getWrite('parent_' + constants.CLOSE_TRANSFER_EVENT))

// em.on(constants.CLOSE_PRIVATE_EVENT, () => alert(`CLOSE_PRIVATE_EVENT - ${Date.now()}`))
// em.on(constants.CLOSE_TRANSFER_EVENT, () => alert(`${constants.CLOSE_TRANSFER_EVENT} - ${Date.now()}`))
