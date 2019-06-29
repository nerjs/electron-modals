const path = require('path')
const { remote: { getCurrentWindow }} = require('electron')

const asyncListener = require('nerjs-utils/core/tests/async_listener')
const EM = require('../../lib/electron_modals')



const template = path.join(__dirname, '..', 'common', 'open_test_template.html')

const {
    TEMPLATE_IS_REQUIRED_MESS,
    WIN_IS_OPEN_MESS
} = require('../../lib')

describe('Open win', () => {

    it('Parent', async () => {
        let em;
        em = new EM('test')

        await expect(em.open()).rejects.toThrow(TEMPLATE_IS_REQUIRED_MESS)


        em = new EM('test', {
            template, 
            winOptions: {
                width: 300, 
                transparent: true,
                center: false,
                frame: false,
                useContentSize: true
            }
        })

        await em.open({
                height: 400
            }, {}, {
                x: 500,
                y: 600
            }) 

        const [ width, height ] = em.win.getSize() 
        // const [ x, y ] = em.win.getPosition()



        expect(em.eventName).toEqual('test');
        expect(width).toEqual(300);
        expect(height).toEqual(400);
        // expect(x).toEqual(500);
        // expect(y).toEqual(600);
        expect(em.win.isModal()).toEqual(false);

        em.win.close()
        
        
        em = new EM('test',{
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


        em.win.close()
        
        
        em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        setTimeout(()=>em.open({}, {test:1}), 2) 
        const [e, d] = await asyncListener(em, `pre:open`)
        expect(d.test).toBe(1);
        
        em.win.close()
        em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        setTimeout(()=>em.open({}, {test:1}), 2) 
        const [e1] = await asyncListener(em, `open`)
        expect(e1).toBe(em.win);

        em.win.close()
    });

    it('Child', async () => {
        const em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        setTimeout(()=>em.open({}, {test:1}), 2)
        const [ e, d ] = await asyncListener(em, 'test1')
        expect(d.test).toEqual(1);

    });

    it('Twice called method open()', async () => {
        const em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        await em.open()

        await expect(em.open()).rejects.toThrow(WIN_IS_OPEN_MESS)
    });
});
