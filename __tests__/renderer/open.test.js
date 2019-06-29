const path = require('path')
const { remote: { getCurrentWindow }} = require('electron')
const EM = require('../../lib/electron_modals')



const template = path.join(__dirname, '..', 'common', 'open_test_template.html')

const {
    TEMPLATE_IS_REQUIRED_MESS
} = require('../../lib')

describe('Open win', () => {

    it('Parent', async () => {
        let em;
        em = new EM('test')

        await expect(em.open()).rejects.toThrow(TEMPLATE_IS_REQUIRED_MESS)


        em = new EM('test', {
            template, 
            winOptions: {
                width: 200, 
                transparent: true,
                center: false
            }
        })

        await em.open({
                height: 201
            }, {}, {
                x: 202,
                y: 203
            }) 

        const [ width, height ] = em.win.getSize() 
        const [ x, y ] = em.win.getPosition()



        expect(em.eventName).toEqual('test');
        expect(width).toEqual(200);
        expect(height).toEqual(201);
        expect(x).toEqual(202);
        expect(y).toEqual(203);
        expect(em.win.isModal()).toEqual(false);

        em.win.close()
        
        
        em = new EM({
            template,
            modal: true,
            winOptions: {
                width: 200, 
                transparent: true,
                center: false
            }
        })

        await em.open()


        expect(em.win.isModal()).toEqual(true);
        expect(em.win.getParentWindow()).toEqual(getCurrentWindow());
        expect(em.eventName).toEqual(`em:${em.win.id}`);
    });
});
