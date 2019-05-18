
const isObject = o => typeof o == 'object' && !Array.isArray(o) && o !== null && !(o instanceof Date)


const merge = (_target, ...args) => {
    if (!_target || !isObject(_target) || args.length == 0) return _target
    const target = {..._target}
    const no = args.shift();
    if (!no || !isObject(no)) return target 

    Object.keys(no).forEach(key => {
        target[key] = isObject(target[key]) ? merge(target[key], no[key]) : no[key]
    })

    return merge(target, ...args)
}



exports = module.exports = merge 
exports.isObject = isObject

