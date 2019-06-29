const path = require('path')
const sleep = require('nerjs-utils/core/sleep')

const EM = require('../../lib/electron_modals')


const template = path.join(__dirname, '..', 'common', 'close_test_template.html')

describe('Close processing', () => {
    it('Parent initiator', async () => {
        const em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        await em.open()

        const win = em.win 

        expect(!win.isDestroyed()).toBeTruthy();
        expect(!em.isClosed).toBeTruthy();
        await em.close()
        expect(win.isDestroyed()).toBeTruthy();
        expect(em.isClosed).toBeTruthy();

    });


    it('Child initiator', async () => {
        const em = new EM('test',{
            template,
            winOptions: {
                transparent: true
            }
        })

        await em.open()

        const win = em.win 


        expect(!win.isDestroyed()).toBeTruthy();
        expect(!em.isClosed).toBeTruthy();
        await em.send('set:close')
        await sleep(100)
        expect(win.isDestroyed()).toBeTruthy();
        expect(em.isClosed).toBeTruthy();
    });
});
