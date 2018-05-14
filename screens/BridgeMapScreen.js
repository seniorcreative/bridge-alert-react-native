import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button
} from 'react-native';
import { Constants, Location, Permissions, Notifications } from 'expo';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline'
import haversine from 'haversine'

import { connect } from 'react-redux';
import * as actions from '../actions';

// start (532 barrabool rd)
// -38.1707008,144.2724222

// end - moriac somewhere
// -38.2646152,144.1676303

import Colors from '../constants/Colors';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const BRIDGE_WARNING_DISTANCE = 500;

class BridgeMapScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      alerts: [],
      locationResult: null,
      isMapReady: false,
      mapWarning: false,
      mapWarningMessage: "",
      coords: {}
    }
  }

  static navigationOptions = {
    header: null,
    title: 'Bridge Map',
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return  {
          latitude : point[0],
          longitude : point[1]
        }
      })
      this.setState({coords: coords})
      return coords
    } catch(error) {
      return error
    }
  };

  componentDidUpdate() {
  }


  componentDidMount() {

        // console.log("notifications permissions", Permissions.getAsync(Permissions.NOTIFICATIONS))
    // console.log("location permissions", Permissions.getAsync(Permissions.LOCATION))
    this._alertIfRemoteNotificationsDisabledAsync()
    this._grantLocationPermission()

    this.getDirections('-38.1707008,144.2724222','-38.2646152,144.1676303')
  }

  _alertIfRemoteNotificationsDisabledAsync = async () => {
    const { Permissions } = Expo;
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      // alert('Hey! You might want to enable notifications for my app, they are good.');
      Permissions.askAsync(Permissions.NOTIFICATIONS)
    }
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  checkDistanceFromBridges = (start) => {

    this.props.Bridges.VIC.map((marker, index) => {
        const end = {
          latitude: marker[3],
          longitude: marker[4]
        }
        // console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))
        // console.log("Metres to", marker[1], haversine(start, end, {unit: 'meter'}))
        marker[5] = Math.round(haversine(start, end, {unit: 'meter'}))
        // if (+marker[5] < 8750 && !marker[6]) {
          // if (+marker[5] < 2000 && this.state.alerts.length < 1) {

          // Check if we are near to a bridge.
          if (+marker[5] < BRIDGE_WARNING_DISTANCE && marker[6] === false) {
          
          let stateProp = this.state.VIC[index]
          stateProp[6] = true
          this.setState({stateProp})
          this.setState({mapWarning: true})
          this.setState({mapWarningMessage: `${marker[5]}m to ${marker[1]} ${marker[2]}m`})

          // console.log("less than distance - bridge alert for mt duneed at", marker[5])
          const localNotification = {
            title: 'Bridge Alert',
            body: this.state.mapWarningMessage,
            ios: {
              sound: true,
              vibrate: true
            },
            android: {
              sound: true,
              vibrate: true
            }
          } //, ios: {sound: true, vibrate: true}, android: {sound: true, vibrate: true}}

          let t = new Date().getTime() + 5000;
          const schedulingOptions = {
            time: t // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
          };

          // let locationNotificationId = Expo.Notifications.presentLocalNotificationAsync(localNotification)

          Expo.Notifications.addListener(this.notificationHandler)

          let locationNotificationId = Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
          // console.log('your notification id', locationNotificationId)
          // this.state.alerts.push(locationNotificationId)
          // console.log("Alerts", this.state.alerts)
        }
      }
    )

  }

  notificationHandler() {
    console.log("got a notification")
  }

  clearWarning() {
    this.setState({mapWarning: false});
  }

  _grantLocationPermission = async () => {
    // let { id } = await navigator.geolocation.
    // // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // if (!id) {
    //   this.setState({
    //     locationResult: 'Permission to access location was denied',
    //   })
    // }
    const { Location, Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {

      this.watchId = await navigator.geolocation.watchPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          this.checkDistanceFromBridges(position.coords)
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
      )

    } else {
      throw new Error('Location permission not granted');
    }

    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({ locationResult: location });


  }

  render() {

    const currentLatitude = this.state.latitude
    const currentLongitude = this.state.longitude

    return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        {currentLatitude && currentLongitude &&
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.99,
            longitudeDelta: 0.99,
          }}
          showsUserLocation={true}
          followUserLocation={true}
          onLayout={this.onMapLayout}
        >
          {this.state.isMapReady && this.props.Bridges.VIC.map(marker => (
            <MapView.Marker
              key={marker[0]}
              coordinate={{latitude: marker[3], longitude: marker[4]}}
              title={`${marker[1]} ${marker[2]}m`}
              pinColor={"#000000"}
              // It doesn't like these markers at all.
              // image={require('../assets/images/Assets.xcassets/AddPin.imageset/Pathwayz-Icon-256.png')}
            />
          ))}
          <MapView.Polyline coordinates={this.state.coords} strokeWidth={2} strokeColor="red" />

        </MapView>
        }
        {this.state.mapWarning &&
        <View>
          <Text >Metres To {this.state.mapWarningMessage}</Text>
          <Button rounded title="ok" onPress={() => this.clearWarning()} color={'#fff'} backgroundColor={'#f00'}></Button>
        </View>
        }
        <View style={styles.bottomView}>
          <Text style={styles.bottomViewText}>{this.props.VehicleHeight / 10}m</Text>
        </View>
      </View>
    </View>
    );
  }
}

const mapStateToProps = state => {
  // console.log("mapStateToProps on bridge map screen", state, state.Bridges)
  return {Bridges: state.Bridges,
  VehicleHeight: state.VehicleHeight}
};

export default connect(mapStateToProps)(BridgeMapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc0'
  },
  mapStyle: {
    flex: 1,
    width,
    height: height - 136,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20
  },
  image: {
    width: viewportWidth,
    flex: 1
  },
  bottomView: {
    width: '20%', 
    height: 38,
    backgroundColor: '#111111', 
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: height - 175,
    left: 10,
    borderRadius: 10
  },
  bottomViewText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16
  }
})
