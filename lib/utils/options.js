

const merge = require('./merge') 
const { isObject } = merge


let _options = {}

const options = (name, no) => {
    if (isObject(name)) {
        _options = merge(_options, name) 
    } else if (typeof name == 'string') {
        if (no === undefined) return _options[name] 
        _options[name] = no;
    }

    return { ..._options };
}


module.exports = options