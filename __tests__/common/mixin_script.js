const Mixin = require('../../lib/close_mixin') 


const mixin = new Mixin(true)
mixin.initialize('test')


mixin.on('test1', () => mixin.send('test2')) 


mixin.on('close', e => e.preventDefault())

mixin.on('remove:prevent', () => mixin.removeAllListeners('close'))


mixin.on('closed', () => mixin.send('confirm:closed'))