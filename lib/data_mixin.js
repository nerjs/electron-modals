const EBT = require('electron-ebt') 

const setOptions = require('./utils/options')



const {
    DATA_PROPS,
    DATA_EVENT,
    DATA_EVENT_INIT,
    IS_DATA_INIT_PROPS
} = require('./utils/constants')

class DataMixin extends EBT {
    constructor() {
        super() 

        this[DATA_PROPS] = setOptions({}) 

        this[IS_DATA_INIT_PROPS] = false

        this.on(DATA_EVENT, (e, d) => {

            if (d.clearAll) {
                this[DATA_PROPS] = setOptions({}) 
            }
            this[DATA_PROPS](d.data) 
            
            if (!this.isDataInit) {
                this[IS_DATA_INIT_PROPS] = true
                this.emit(DATA_EVENT_INIT, this.data)
            }
        })  
        
        this.on('reinitialize', () => {
            this[DATA_PROPS] = setOptions({}) 
    
            this[IS_DATA_INIT_PROPS] = false
        })

    }

    get isDataInit() {
        return !!this[IS_DATA_INIT_PROPS]
    }

    get data() {
        return this[DATA_PROPS]()
    }

    async setData(d, clearAll) {
        if (clearAll) {
            this[DATA_PROPS] = setOptions({}) 
        }
        this[DATA_PROPS](d) 

        await this.send(DATA_EVENT, {
            data: this.data,
            clearAll
        })
        return this.data
    }

    subscribeData(cb) {
        const handler = () => cb(this.data)
        this.on(DATA_EVENT, handler)

        const remove = () => this.removeListener(DATA_EVENT, handler)

        return remove
    }
}


module.exports = DataMixin
