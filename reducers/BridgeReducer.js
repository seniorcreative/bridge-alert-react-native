// import data from './BridgeList.json';
const INITIAL_STATE = {bridges: []};

// export default () => data;

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'fetch_bridges':
            console.log("bridgeReducer got", action.payload)
            return { ...state, bridges: action.payload }
        default: 
            return state;
    }
}