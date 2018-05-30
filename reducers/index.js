import { combineReducers } from 'redux';
import BridgeReducer from './BridgeReducer';
import VehicleReducer from './VehicleReducer';
import VehicleHeightReducer from './VehicleHeightReducer';
import AustralianStateReducer from './AustralianStateReducer';
import CoordsReducer from './CoordsReducer';
import ScreenReducer from './ScreenReducer';
import WarningReducer from './WarningReducer';

export default combineReducers({
    Bridges: BridgeReducer,
    Vehicles: VehicleReducer,
    VehicleHeight: VehicleHeightReducer,
    AustralianState: AustralianStateReducer,
    Coords: CoordsReducer,
    Screen: ScreenReducer,
    Warnings: WarningReducer
});