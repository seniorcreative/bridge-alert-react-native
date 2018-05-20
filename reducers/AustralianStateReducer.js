export default (state = 'QLD', action) => {
    switch(action.type) {
        case 'set_australian_state':
            return action.payload;
        default:
            return state;
    }
}