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

// Route is an array, start and end point lat and lon
export const setRoute = (route) => {
    return {
        type: "set_route",
        payload: route
    }
}

// Track which is our current screen (useful for stopping location checks on home screen etc)
export const setScreen = (screen) => {
    return {
        type: "set_screen",
        payload: screen
    }
}