export default (state = 25, action) => {
    switch(action.type) {
        case 'set_vehicle_height':
            return action.payload;
        default:
            return state;
    }
}