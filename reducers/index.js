import { combineReducers } from 'redux';
import BridgeReducer from './BridgeReducer';
import VehicleReducer from './VehicleReducer';
import VehicleHeightReducer from './VehicleHeightReducer';
import AustralianStateReducer from './AustralianStateReducer';
import RouteReducer from './RouteReducer';
import ScreenReducer from './ScreenReducer';

export default combineReducers({
    Bridges: BridgeReducer,
    Vehicles: VehicleReducer,
    VehicleHeight: VehicleHeightReducer,
    AustralianState: AustralianStateReducer,
    Route: RouteReducer,
    Screen: ScreenReducer
});