
const EMC = require('../../lib/child_electron_modals')
const constants = require('../../lib/utils/constants')

// const OCE = require('../../lib/close_mixin')

// const oce = new OCE(true, 'test') 

// oce.initialize()

const emc = new EMC()



emc.on(constants.CLOSE_PRIVATE_EVENT, (e, d) => {
    console.log('CLOSE_PRIVATE_EVENT:', constants.CLOSE_PRIVATE_EVENT)
    console.log(e)
    console.log(d)
    console.log('*******************')
})