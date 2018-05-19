export default (state = 'VIC', action) => {
    switch(action.type) {
        case 'set_australian_state':
            return action.payload;
        default:
            return state;
    }
}