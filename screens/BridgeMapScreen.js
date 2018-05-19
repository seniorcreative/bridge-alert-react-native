import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import { Constants, Location, Permissions, Notifications } from 'expo';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline'
import haversine from 'haversine'


// start (532 barrabool rd)
// -38.1707008,144.2724222

// end - moriac somewhere
// -38.2646152,144.1676303

import Colors from '../constants/Colors';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class BridgeMapScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      alerts: [],
      locationResult: null,
      isMapReady: false,
      coords: {},
      QLD: [[162,'Gympie Arterial Rd',4.9,-27.3177503,153.0128727],
        [164,'Cunningham Hwy',5.2,-27.64579,152.78956],
        [165,'Park/Baroona Rd',3.3,-27.46936,153.00398],
        [166,'Oxley Rd',3.6,-27.53678,152.98219],
        [167,'Sherwood Rd/Muriel Ave',3.8,-27.54142,153.01165],
        [168,'Kessels Rd',4.7,-27.25062,153.01852],
        [170,'Ipswich Rd',4.7,-27.49264,153.03484],
        [171,'Bruce Hwy',4.9,-27.17868,152.98371],
        [172,'Sumners Rd',5.3,-27.5591737,152.9397813],
        [173,'Pacific Mwy/Mandew St',5.4,-27.65479,153.16393],
        [174,'Pacific Mwy/Tora St',5.0,-27.55599,153.0717],
        [175,'Pacific Mwy/Loganlea Rd',5.3,-27.6441612,153.1459074],
        [176,'Donaldson Rd/Ipswich Mwy',5.4,-27.5621481,152.9941047],
        [179,'Ipswich Rd',5.4,-27.4961913,153.0350093],
        [181,'Activity St',5.1,-27.59164,153.03869],
        [182,'Annerley Rd',3.7,-27.49183,153.0274],
        [183,'Bribie Island Rd/Bruce Hwy',5.2,-27.08574,152.97528],
        [184,'Brisbane Rd',5.2,-27.59644,152.83748],
        [185,'Countess St',4.4,-27.4652335,153.015816],
        [186,'Cunningham Hwy',5.1,-27.5969717,152.8359562],
        [188,'National Hwy 15/Cunningham Hwy',5.2,-27.6319209,152.8139601],
        [190,'Main St/Pacific Mwy',3.9,-27.7226924,153.2172851],
        [191,'Vulture St/Pacific Mwy',4.6,-27.4838805,153.0313642],
        [196,'Shafston Ave',4.6,-27.4739545,153.0357757],
        [197,'Strathpine Rd/Gympie Arterial Rd',4.8,-27.318141,153.0129266],
        [200,'Wynnum Rd',4.7,-27.4670562,153.0800113]],
      VIC: [[1,'Mount Duneed Rd',3.2,-38.2349393,144.217468, 0, false]]
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

    this.state.VIC.map(marker => {
        const end = {
          latitude: marker[3],
          longitude: marker[4]
        }
        // console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))
        // console.log("Metres to", marker[1], haversine(start, end, {unit: 'meter'}))
        marker[5] = haversine(start, end, {unit: 'meter'})
        // if (+marker[5] < 8750 && !marker[6]) {
        if (+marker[5] < 2000 && this.state.alerts.length < 1) {
          // marker[6] = true
          console.log("less than distance - bridge alert for mt duneed at", marker[5])
          const localNotification = {
            title: 'Bridge Alert',
            body:'Mt Duneed Low Bridge 3.2m',
            ios: {
              sound: true
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

    // console.log("notifications permissions", Permissions.getAsync(Permissions.NOTIFICATIONS))
    // console.log("location permissions", Permissions.getAsync(Permissions.LOCATION))
    this._alertIfRemoteNotificationsDisabledAsync()
    this._grantLocationPermission()

    const currentLatitude = this.state.latitude
    const currentLongitude = this.state.longitude

    return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../assets/images/bridge-alert-logo.png')}
          style={styles.welcomeImage}
        />
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        {currentLatitude && currentLongitude &&
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.59,
            longitudeDelta: 0.59,
          }}
          showsUserLocation={true}
          followUserLocation={true}
          onLayout={this.onMapLayout}
        >
          {this.state.isMapReady && this.state.VIC.map(marker => (
            <MapView.Marker
              key={marker[0]}
              coordinate={{latitude: marker[3], longitude: marker[4]}}
              title={marker[1]}
              image={require('../assets/images/Assets.xcassets/AddPin.imageset/Pathwayz-Icon-256.png')}
            />
          ))}
          <MapView.Polyline coordinates={this.state.coords} strokeWidth={2} strokeColor="red"/>

        </MapView>
        }
        <Text >Metres To Mt Duneed: {this.state.VIC[0][5]}</Text>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc0'
  },
  map: {
    flex: 1,
    width,
    height: height - 160,
    position: 'absolute',
    top: 80,
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
  welcomeImage: {
    width: viewportWidth,
    height: 90,
    resizeMode: 'contain',
    marginTop: 0,
    // marginLeft: -10,
  },
  image: {
    width: viewportWidth,
    flex: 1
  },
})
