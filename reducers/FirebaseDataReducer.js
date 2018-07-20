const INITIAL_STATE = {data: {bridges: [], settings: {}, content: {}}};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'fetch_data':
            return { ...state, data: action.payload }
        default: 
            return state;
    }
}