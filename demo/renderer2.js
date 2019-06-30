
const EMC = require('../../lib/child_electron_modals')
const constants = require('../../lib/utils/constants')

// const OCE = require('../../lib/close_mixin')

// const oce = new OCE(true, 'test') 

// oce.initialize()

const emc = new EMC()

// emc.on('close', e => alert(`close: ${e.initiator}`))
// emc.on('closed', e => alert(`closed: ${e.initiator}`))

// emc.on(constants.CLOSE_PRIVATE_EVENT, (e, d) => {
//     console.log('CLOSE_PRIVATE_EVENT:', constants.CLOSE_PRIVATE_EVENT)
//     console.log(e)
//     console.log(d)
//     console.log('*******************')
// })

// window.onbeforeunload = 
// const fs = require('fs')
// const path = require('path') 


// const writef = name => {
//     fs.writeFile(path.join(__dirname, 'z', `${name}.txt`), Date.now(), e => {
//         if (e) alert(e.message)
//     }) 
// }

// const getWrite = name => () => writef(name)


// emc.on(constants.CLOSE_PRIVATE_EVENT, getWrite('child_CLOSE_PRIVATE_EVENT'))
// emc.on(constants.CLOSE_TRANSFER_EVENT, getWrite('child_' + constants.CLOSE_TRANSFER_EVENT))

// emc.on(, () => {

// } alert(`CLOSE_PRIVATE_EVENT - ${Date.now()}`))
// // emc.on(constants.CLOSE_TRANSFER_EVENT, () => alert(`${constants.CLOSE_TRANSFER_EVENT} - ${Date.now()}`))


/*

initiator - parent

child transfer - 1561895912319 - 1561896397614 - 1561896448073
child private  - 1561895912325 - 1561896397615 - 1561896448076
parent private - 1561895912329 - 1561896397622 - 1561896448080

initiator - child 

parent trannsfer - 1561896033353 - 1561896509468 - 1561896564207
child private    - 1561896033362 - 1561896509470 - 1561896564210
parent private   - 1561896033363 - 1561896509473 - 1561896564212

*/


// window.onbeforeunload = (e, d) => {
//     getWrite('bofore')()
//     // return true
// }