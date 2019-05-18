const options = require('../utils/options')


describe('options util', () => {
    it('options', () => {
        expect(options()).toEqual({});

        options({
            a: 1
        })

        expect(options().a).toEqual(1);
        expect(options('a')).toEqual(1);
        expect(options()).toEqual({ a: 1});


        options('test', 2)

        expect(options('test')).toEqual(2);
        expect(options()).toEqual({a:1, test: 2});


        options('test', {
            a: 1, 
            b: {
                c: 2,
                d: {
                    e: 3
                }
            }
        })


        expect(options('test')).toEqual({
            a: 1, 
            b: {
                c: 2,
                d: {
                    e: 3
                }
            }
        });


        expect(options()).toEqual({
            a: 1,
            test: {
                a: 1, 
                b: {
                    c: 2,
                    d: {
                        e: 3
                    }
                }
            }
        });

    });
});

