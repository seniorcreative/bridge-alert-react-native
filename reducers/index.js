import { combineReducers } from 'redux';
import FirebaseDataReducer from './FirebaseDataReducer';
import VehicleReducer from './VehicleReducer';
import VehicleHeightReducer from './VehicleHeightReducer';
import AustralianStateReducer from './AustralianStateReducer';
import CoordsReducer from './CoordsReducer';
import ScreenReducer from './ScreenReducer';
import WarningReducer from './WarningReducer';

export default combineReducers({
    FirebaseData: FirebaseDataReducer,
    Vehicles: VehicleReducer,
    VehicleHeight: VehicleHeightReducer,
    AustralianState: AustralianStateReducer,
    Coords: CoordsReducer,
    Screen: ScreenReducer,
    Warnings: WarningReducer
});