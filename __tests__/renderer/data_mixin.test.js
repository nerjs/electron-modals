const { ipcRenderer } = require('electron')
const path = require('path')
const ipcMain = require('nerjs-utils/electron/ipc_main')
const openWinScript = require('nerjs-utils/electron/tests/open_win_script')
const asyncSending = require('nerjs-utils/electron/tests/async_sending')
const asyncListener = require('nerjs-utils/core/tests/async_listener')
const sleep = require('nerjs-utils/core/sleep')
const Mixin = require('../../lib/data_mixin')
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
    CLOSE_IN_PROGRESS_MESS,
    CLOSE_BEFORE_OPEN_MESS,

    DATA_PROPS,
    DATA_EVENT,
    DATA_EVENT_INIT,
    IS_DATA_INIT_PROPS
} = require('../../lib')


const getArgs = win => [
    {
        name: 'test_data',
        sender: win.webContents,
        listener: ipcMain
    }
]


describe('Data mixin', () => {
    it('Init mixin', () => {
        const mixin = new Mixin()

        expect(mixin[IS_DATA_INIT_PROPS]).toEqual(false);
        expect(mixin.isDataInit).toEqual(false);
        expect(mixin.data).toEqual(mixin[DATA_PROPS]());
    });

    it('Send data', async () => {
        let res;
        const mixin = new Mixin()
        
        const win = await openWinScript(path.join(__dirname, '..', 'common', 'data_test.js')) 

        mixin.initialize(...getArgs(win))
        const send = asyncSending(mixin, 100)

        send('test1')
        res = await asyncListener(mixin, 'test2')
        expect(mixin.data).toEqual({});
        expect(res[1].d).toEqual({});
        expect(res[1].isDataInit).toEqual(false);

        await mixin.setData({a:1}) 
        send('test1')
        res = await asyncListener(mixin, 'test2')
        expect(res[1].d).toEqual({a:1});
        expect(mixin.data).toEqual({a:1});
        expect(res[1].isDataInit).toEqual(true);
        

        await mixin.setData({b: 2}) 
        send('test1')
        res = await asyncListener(mixin, 'test2')
        expect(mixin.data).toEqual({a: 1, b: 2});
        expect(res[1].d).toEqual({a: 1, b: 2});

        await mixin.setData({c: 3}, true) 
        send('test1')
        res = await asyncListener(mixin, 'test2')
        expect(mixin.data).toEqual({c: 3});
        expect(res[1].d).toEqual({c: 3});
    });

    it('Get data', async () => {
        let res;
        const mixin = new Mixin()
        
        const win = await openWinScript(path.join(__dirname, '..', 'common', 'data_test.js')) 

        mixin.initialize(...getArgs(win))
        const send = asyncSending(mixin, 100)



        send('test3')
        res = await asyncListener(mixin, 'test4')
        expect(res[1]).toEqual({a:1});
        expect(mixin.data).toEqual({a:1});
        

        send('test5')
        res = await asyncListener(mixin, 'test6')
        expect(mixin.data).toEqual({a: 1, b: 2});
        expect(res[1]).toEqual({a: 1, b: 2});

        
        send('test7')
        res = await asyncListener(mixin, 'test8')
        expect(mixin.data).toEqual({c: 3});
        expect(res[1]).toEqual({c: 3});
        
    });

});
