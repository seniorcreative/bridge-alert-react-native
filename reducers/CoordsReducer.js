const INITIAL_STATE = { coords: [] }

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'set_coords':
            return { ...state, coords: action.payload };
        default:
            return state;
    }
}