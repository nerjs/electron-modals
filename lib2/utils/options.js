const diff = require('deep-diff')
const merge = require('merge')
const { recursive } = merge




module.exports = props => {
    let initProps = props;
    let _options = merge(true, props)



    const options = (target, ...args) => {
        if (args.length == 0 && typeof target == 'string') return _options[target]
        if (args.length > 0 && typeof target == 'string') return options({ [target]: args[0] })
        if (!target || typeof target != 'object' || Array.isArray(target)) return merge(true, _options)

        const t = recursive(merge(true,_options), target)
        const difArr = diff(_options, t)
        _options = t 
        return difArr
    }

    options.reset = () => {
        _options = initProps;
    }

    options.clear = () => {
        initProps = {};
        _options = {};
    }

    return options
}