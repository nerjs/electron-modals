const Mixin = require('../../lib/data_mixin') 
const { ipcRenderer } = require('electron')


const mixin = new Mixin()

const getArgs = () => [
    {
        name: 'test_data',
        sender: ipcRenderer,
        listener: ipcRenderer
    }
]

mixin.initialize(...getArgs())



mixin.on('test1', () => mixin.send('test2', { d: mixin.data, isDataInit: mixin.isDataInit}))


mixin.on('test3', async () => {
    await mixin.setData({a:1})
    await mixin.send('test4', mixin.data)
})
mixin.on('test5', async () => {
    await mixin.setData({b:2})
    await mixin.send('test6', mixin.data)
})
mixin.on('test7', async () => {
    await mixin.setData({c:3}, true)
    await mixin.send('test8', mixin.data)
})

window.mixin = mixin