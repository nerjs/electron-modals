exports.IPC_EVENT_NAME = '__EM_EVENT__'
exports.PREFIX = 'em'

exports.TYPE_EVENT_OPEN = 'em_open'
exports.TYPE_EVENT_CLOSE = 'em_close'
exports.TYPE_EVENT_CLOSED = 'em_closed'
exports.TYPE_EVENT_MESSAGE = 'em_message'
exports.TYPE_EVENT_CLOSE_PREVENTED = 'em_close-prevented' 


exports.EVENT_CLOSE_COMMAND = 'em:command:close'
exports.EVENT_CLOSE = 'close'
exports.EVENT_CLOSED = 'closed'
exports.EVENT_PRE_CLOSED = 'pre:closed'
exports.EVENT_CLOSE_PREVENTED = 'close:prevented'


exports.INITIAL_DATA_EVENT = 'initialdata'

// TIMEOUTS

exports.TIMEOUT_WAIT_CB = 1000
exports.TIMEOUT_WAIT_CB_LONG = 60000

exports.TIMEOUT_OPEN_WIN = 4000
exports.TIMEOUT_CLOSE_WIN = 1000


// PROPS

exports.IS_OPEN_PROPS = Symbol('isOpen')
exports.IS_OPEN_IN_PROGRESS_PROPS = Symbol('isOpen in progress')
exports.IS_CLOSED_PROPS = Symbol('isClosed')
exports.IS_MODAL_PROPS = Symbol('isModal')
exports.IS_START_CLOSED_PROPS = Symbol('isStartClosed')
exports.DEFAULT_EVENT_NAME_PROPS = Symbol('defaultEventName') 
exports.DATA_PROPS = Symbol('Data props')
exports.IS_DATA_INIT_PROPS = Symbol('Is data init')

// MESSAGES 

exports.WIN_UNDEFINED_MESS = 'win[BrowserWindow] is undefined or not valid'
exports.WEB_CONTENTS_UNDEFINED_MESS = 'win[BrowserWindow].webContents is undefined or not valid' 

exports.CLOSE_PREVENTED_CURRENT_TARGET_MESS = 'Close was prevented [current target]'
exports.CLOSE_PREVENTED_ANOTHER_TARGET_MESS = 'Close was prevented [another target]'

exports.CLOSE_IN_PROGRESS_MESS = 'Close in progress' 
exports.CLOSE_BEFORE_OPEN_MESS = 'You cannot call a closing before opening'

exports.WIN_IS_OPEN_MESS = 'The window is already open or is in progress. '
exports.TEMPLATE_IS_REQUIRED_MESS = 'Template is required'

// EVENTS 


exports.OPEN_PRIVATE_EVENT = Symbol('private open Event')
exports.OPEN_PUBLIC_EVENT = 'open'

exports.CLOSE_PRIVATE_EVENT = Symbol('private close Event')
exports.CLOSE_TRANSFER_EVENT = 'em:close:transfer'
exports.CLOSE_PREVENTED_EVENT = 'em:close:prevented'
exports.CLOSE_PUBLIC_EVENT = 'close'

exports.CLOSED_PUBLIC_EVENT = 'closed' 

exports.DATA_EVENT = 'em:data'
exports.DATA_INIT_EVENT = 'em:data:init'