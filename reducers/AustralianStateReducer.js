const INITIAL_STATE = { austate: "VIC" }

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'set_australian_state':
            return { ...state, austate: action.payload}
        default:
            return state;
    }
}