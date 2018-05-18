export default (state = [null,null], action) => {
    switch(action.type) {
        case 'set_route':
            return action.payload;
        default:
            return state;
    }
}