const { ipcRenderer } = require('electron')
const path = require('path')
const ipcMain = require('nerjs-utils/electron/ipc_main')
const openWinScript = require('nerjs-utils/electron/tests/open_win_script')
const asyncSending = require('nerjs-utils/electron/tests/async_sending')
const asyncListener = require('nerjs-utils/core/tests/async_listener')
const IpcFalse = require('nerjs-utils/electron/tests/ipc_false')
const sleep = require('nerjs-utils/core/sleep')
const Mixin = require('../../lib/close_mixin')
const TestWin = require('../common/win')

const {
    TIMEOUT_WAIT_CB,
    DEFAULT_EVENT_NAME_PROPS,
    TIMEOUT_WAIT_CB_LONG,
    WIN_UNDEFINED_MESS,
    WEB_CONTENTS_UNDEFINED_MESS,
    CLOSE_PREVENTED_CURRENT_TARGET_MESS,
    CLOSE_PREVENTED_ANOTHER_TARGET_MESS,
    CLOSE_PUBLIC_EVENT, 
    CLOSE_PRIVATE_EVENT,
    CLOSED_PUBLIC_EVENT,
    CLOSE_PREVENTED_EVENT,
    CLOSE_IN_PROGRESS_MESS
} = require('../../lib')


describe('Close mixin', () => {
        
    it('start data', () => {
        let mixin;

        mixin = new Mixin(true, 'test')

        expect(mixin.isModal).toBeTruthy();
        expect(mixin[DEFAULT_EVENT_NAME_PROPS]).toBe('test');
        expect(mixin.timerOptions).toStrictEqual({
            confirmTimeout: TIMEOUT_WAIT_CB,
            waitConfirmTimeout: TIMEOUT_WAIT_CB_LONG
        });

        mixin = new Mixin(false, 'test2', {
            confirmTimeout: 123,
            waitConfirmTimeout: 321
        })

        expect(!mixin.isModal).toBeTruthy();
        expect(mixin[DEFAULT_EVENT_NAME_PROPS]).toBe('test2');
        expect(mixin.timerOptions).toStrictEqual( {
            confirmTimeout: 123,
            waitConfirmTimeout: 321
        });

        expect(!mixin.isStartClosed).toBeTruthy();

    });

    it('initialize is modal', () => {
        const mixin = new Mixin(true, 'test1')
        
        mixin.initialize()

        expect(mixin.eventName).toBe('test1');
        expect(mixin.ipcSender).toBe(ipcRenderer);
        expect(mixin.ipcListener).toBe(ipcRenderer);

        mixin.initialize('test2') 

        expect(mixin.eventName).toBe('test2');

    });

    it('initialize is not modal', () => {
        const mixin = new Mixin(false, 'test1')
        const win = new TestWin()


        expect(() => {
            mixin.initialize()
        }).toThrow(WIN_UNDEFINED_MESS);

        expect(() => {
            mixin.initialize('test2')
        }).toThrow(WIN_UNDEFINED_MESS);

        expect(() => {
            mixin.initialize({})
        }).toThrow(WEB_CONTENTS_UNDEFINED_MESS);

        mixin.initialize(win)

        expect(mixin.ipcSender).toBe(win.webContents);
        expect(mixin.ipcListener).toBe(ipcMain); 
        expect(mixin.eventName).toBe(mixin[DEFAULT_EVENT_NAME_PROPS]);
        expect(mixin.eventName).toBe('test1');


        mixin.initialize(win, 'test2')
        expect(mixin.eventName).toBe('test2');
    });

    it('prevent default (is initiator)', async () => {
        const mixin = new Mixin(true, 'test')
        let res;
        
        mixin.once(CLOSE_PUBLIC_EVENT, e => e.preventDefault())


        await expect(mixin.close()).rejects.toThrow(CLOSE_PREVENTED_CURRENT_TARGET_MESS)
        
        setTimeout(() => mixin.close(), 10)
        res = await asyncListener(mixin, CLOSE_PUBLIC_EVENT) 
        expect(res[0].initiator).toBe(true);
        
        setTimeout(() => mixin.close(), 10)
        mixin.once(CLOSE_PUBLIC_EVENT, e => e.preventDefault())
        res = await asyncListener(mixin, CLOSE_PREVENTED_EVENT) 
        expect(res[0].initiator).toBe(true);
    });

    it('prevent default (is not initiator)', async () => {
        const mixin = new Mixin(false, 'test')
        const win = await openWinScript(path.join(__dirname, '..', 'common', 'mixin_script.js')) 

        const send = asyncSending(mixin)

        mixin.initialize(win, 'test')

        send('test1')
        await asyncListener(mixin, 'test2')


        setTimeout(() => mixin.close(), 10)
        res = await asyncListener(mixin, CLOSE_PREVENTED_EVENT)
        expect(!res[0].initiator).toBeTruthy();
        await sleep(20)

        await expect(mixin.close(true)).rejects.toThrow(CLOSE_PREVENTED_ANOTHER_TARGET_MESS)
    });

    it('Twice called method close()', async () => {
        const mixin = new Mixin(true, 'test')
        mixin.initialize();

        mixin.close()

        await expect(mixin.close(true)).rejects.toThrow(CLOSE_IN_PROGRESS_MESS)
    });


    it('Closed', async () => {
        const mixin = new Mixin(false, 'test')
        const win = await openWinScript(path.join(__dirname, '..', 'common', 'mixin_script.js')) 
        
        mixin.initialize(win, 'test')

        await mixin.send('remove:prevent')

        setTimeout(() => mixin.close(), 2)
        await asyncListener(mixin, CLOSE_PRIVATE_EVENT)
        await asyncListener(mixin, CLOSED_PUBLIC_EVENT)
        await sleep(10)


        setTimeout(() => mixin.close(), 2)
        await asyncListener(mixin, 'confirm:closed')
        await asyncListener(mixin, CLOSED_PUBLIC_EVENT)
    });
});