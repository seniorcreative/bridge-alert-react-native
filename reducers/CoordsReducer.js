export default (state = [], action) => {
    switch(action.type) {
        case 'set_coords':
            return action.payload;
        default:
            return state;
    }
}