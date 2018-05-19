export default (state = 'HomeScreen', action) => {
    switch(action.type) {
        case 'set\_screen':
            return action.payload;
        default:
            return state;
    }
}