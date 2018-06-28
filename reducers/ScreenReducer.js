export default (state = 'HomeScreen', action) => {
    switch(action.type) {
        case 'set_screen':
            return { ...state, screen: action.payload}
        default:
            return state;
    }
}