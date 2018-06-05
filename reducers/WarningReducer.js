const INITIAL_STATE = { 
    visible: false, 
    radius: 250, 
    mapalertvisible: false }

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'set_warning_visible':
            return { ...state, visible: action.payload }
        case 'set_map_alert_visible':
            return { ...state, mapalertvisible: action.payload }
        case 'set_warning_radius':
            return { ...state, radius: action.payload }
        default:
            return state;
    }
}