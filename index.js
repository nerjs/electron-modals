module.exports = require('./lib/renderer_process')

// const Application = require('spectron').Application
// const assert = require('assert')
// const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
// const path = require('path')

// const app = new Application({
//     path: electronPath, 
//     host: '192.168.0.102', 
//     waitTimeout: 30000,
//     port: 3333,
//     args: [path.join(__dirname)]
// }) 
// console.log(app)
// // console.log(app.start())
// app.start().then(r => {
//     console.log('******************')
//     console.log(r)
// }, e => {
//     console.log('___________________')
//     console.log(e)
// }).catch(e => {
//     consople.log('///////////////////////')
//     console.log(e)
// })