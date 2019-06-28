// exports.ElectronModals = require('./electron_modals')
// exports.ChildElectronModals = require('./child_electron_modals')

const constants = require('./utils/constants') 

Object.keys(constants).forEach(key => {
    exports[key] = constants[key]
})
