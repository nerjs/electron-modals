const {  ipcRenderer } = require('electron')

const btns = document.getElementsByClassName('btn') 

console.log(btns)
for (let i = 0; i < btns.length; i++) {
    console.log(btns[i])
    btns[i].addEventListener('click', function() {
        ipcRenderer.send('test', 'click', this.innerText)
        
    })
}