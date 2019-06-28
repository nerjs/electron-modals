const EM = require('../../lib/electron_modals')


const {
    DEFAULT_EVENT_NAME_PROPS,
    TIMEOUT_WAIT_CB,
    TIMEOUT_WAIT_CB_LONG, 
    TIMEOUT_OPEN_WIN,
    IS_OPEN_PROPS,
    IS_CLOSED_PROPS,
    IS_OPEN_IN_PROGRESS_PROPS
} = require('../../lib')

describe('Init EM', () => {
    it('Parent init', () => {
        let em;
        em = new EM('test')

        expect(em[DEFAULT_EVENT_NAME_PROPS]).toEqual('test');
        expect(em.options().winOptions).toStrictEqual(EM.defWinProps());
        expect(em.options().modal).toEqual(false);
        expect(em.options().template).toEqual(null);
        expect(em[IS_OPEN_PROPS]).toEqual(false);
        expect(em[IS_CLOSED_PROPS]).toEqual(false);
        expect(em[IS_OPEN_IN_PROGRESS_PROPS]).toEqual(false);
        expect(em.isOpen).toEqual(false);
        expect(em.isClosed).toEqual(false);
        expect(em.isOpenInProgress).toEqual(false); 


        expect(em.options().confirmTimeout).toEqual(TIMEOUT_WAIT_CB);
        expect(em.options().waitConfirmTimeout).toEqual(TIMEOUT_WAIT_CB_LONG);
        expect(em.options().timeoutOpenWin).toEqual(TIMEOUT_OPEN_WIN);

        em = new EM({
            template: 'test template',
            icon: 'test icon',
            modal: true,
            confirmTimeout: 1,
            waitConfirmTimeout: 2,
            timeoutOpenWin: 3, 
            winOptions: {
                width: 123,
                height: 321,
                webPreferences: {
                    testOption: 456
                }
            }
        })




        expect(em.options().modal).toEqual(true);
        expect(em.options().template).toEqual('test template');
        expect(em.options().icon).toEqual('test icon');
        expect(em.options().confirmTimeout).toEqual(1);
        expect(em.options().waitConfirmTimeout).toEqual(2);
        expect(em.options().timeoutOpenWin).toEqual(3);

        expect(em.options().winOptions.width).toEqual(123);
        expect(em.options().winOptions.height).toEqual(321);
        expect(em.options().winOptions.webPreferences.testOption).toEqual(456);

    });
});
