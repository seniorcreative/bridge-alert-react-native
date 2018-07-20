import { bridgesRef } from "../config/firebase";

export const setVehicleHeight = (vehicleHeight) => {
    return {
        type: "set_vehicle_height",
        payload: vehicleHeight
    }
}

// Only VIC, QLD and NSW state data is available in this app
export const setAustralianState = (australianState) => {
    return {
        type: "set_australian_state",
        payload: australianState
    }
}

// Coords is an array of lat & lon points for a polyline.
export const setCoords = (coords) => {
    return {
        type: "set_coords",
        payload: coords
    }
}

// Track which is our current screen (useful for stopping location checks on home screen etc)
export const setScreen = (screen) => {
    return {
        type: "set_screen",
        payload: screen
    }
}

// The size of the coloured overlay zones around the markers
export const setWarningRadius = (radius) => {
    return {
        type: "set_warning_radius",
        payload: radius
    }
}

// The visibility of the coloured overlay zones around the markers
export const setWarningVisible = (visible) => {
    return {
        type: "set_warning_visible",
        payload: visible
    }
}

// The visibility of the alert on the map
export const setMapAlertVisible = (mapalertvisible) => {
    return {
        type: "set_map_alert_visible",
        payload: mapalertvisible
    }
}

// Load in the bridges from firebase db
export const fetchData = () => async dispatch => {
    console.log("fetching data...", bridgesRef);
    bridgesRef.on("value", snapshot => {
      console.log("fetched data", snapshot);
      dispatch({
        type: "fetch_data",
        payload: snapshot.val()
      });
    }, (error) => {console.error(error)});
  };