const INITIAL_STATE = { visible: true, radius: 250 }

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'set_warning_visible':
            return { ...state, visible: action.payload }
        case 'set_warning_radius':
            return { ...state, radius: action.payload }
        default:
            return state;
    }
}