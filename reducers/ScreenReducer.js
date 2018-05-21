export default (state = 'HomeScreen', action) => {
    switch(action.type) {
        case 'set_screen':
            return action.payload;
        default:
            return state;
    }
}