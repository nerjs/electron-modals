const merge = require('../utils/merge')
const { isObject } = merge


class A {}

describe('merge object utils', () => {
    it('isObject', () => {
        expect(isObject()).toEqual(false)
        expect(isObject('a')).toEqual(false)
        expect(isObject(1)).toEqual(false)
        expect(isObject([])).toEqual(false)
        expect(isObject(null)).toEqual(false)
        expect(isObject(()=>{})).toEqual(false)
        expect(isObject(new Date)).toEqual(false)

        expect(isObject({})).toEqual(true)
        expect(isObject(new A)).toEqual(true)
    })

    it('merge', () => {
        const obj1 = {
            a: 1,
            b: 2, 
            c: [1,2,3]
        } 

        const obj2 = {
            a: 1,
            b: obj1
        } 

        const obj3 = {
            a: obj2,
            b: obj1
        }
        
        expect({}).not.toBe(obj1);
        expect(obj1).toBe(obj1);


        expect(merge(obj1)).toBe(obj1);
        expect(merge(obj1, {})).not.toBe(obj1);
        
        expect(merge(obj1, {b:3})).toEqual({
            a: 1,
            b: 3,
            c: [1,2,3]
        });
        
        expect(merge(obj2, {a:2})).toEqual({
            b: obj1,
            a: 2
        });


        expect(merge(obj2, {b: {c:3}})).toEqual({
            a: 1,
            b: { ...obj1, c: 3}
        });


        expect(merge(obj3, {a: {b: {b: 4}}})).toEqual({
            b: {...obj1},
            a: {
                a: 1, 
                b: {
                    ...obj1,
                    b: 4
                }
            }
        });

    });
})



