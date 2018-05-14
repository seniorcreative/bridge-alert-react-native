import { combineReducers } from 'redux';
import BridgeReducer from './BridgeReducer';
import VehicleReducer from './VehicleReducer';
import VehicleHeightReducer from './VehicleHeightReducer';


export default combineReducers({
    Bridges: BridgeReducer,
    Vehicles: VehicleReducer,
    VehicleHeight: VehicleHeightReducer
});