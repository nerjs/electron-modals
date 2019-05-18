

const options = require('./utils/options')



options({
    pathTemplates: __dirname,
    pathIcons: __dirname
})



const pathTemplates = nt => options('pathTemplates', nt)
const pathIcons = nt => options('pathIcons', nt)












exports.options = options
exports.pathTemplates = pathTemplates 
exports.pathIcons = pathIcons