import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  TouchableOpacity
} from 'react-native'
import { Constants, Location, Permissions, Notifications } from 'expo'
import {
  AdMobBanner,
  AdMobInterstitial,
} from "expo";

import MapView from 'react-native-maps'
import Polyline from '@mapbox/polyline'
import haversine from 'haversine'

import { connect } from 'react-redux'
import * as actions from '../actions'

import Colors from '../constants/Colors'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
// const AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111'; // TEST ID
const AD_UNIT_ID = 'ca-app-pub-5368979163797748/5946924506'; // LIVE ID
const AD_DEVICE_ID = 'EMULATOR'; // TEST DEVICE ID
// const AD_DEVICE_ID = 'APP'; // LIVE DEVICE ID

// const BRIDGE_WARNING_DISTANCE = 500
const DEFAULT_PADDING = { top: 25, right: 25, bottom: 25, left: 25 }
const MAP_DELTA = 0.25

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
      mapWarningMessage: ""
    }

  }

  static navigationOptions = {
    header: null,
    title: 'Bridge Map',
  }

  // onCoordsSet(coords) {

  // }


  componentDidMount() {

        // console.log("notifications permissions", Permissions.getAsync(Permissions.NOTIFICATIONS))
    // console.log("location permissions", Permissions.getAsync(Permissions.LOCATION))
    this._alertIfRemoteNotificationsDisabledAsync();
    this._grantLocationPermission();


    // }
    AdMobInterstitial.setTestDeviceID(AD_DEVICE_ID);
    // ALWAYS USE TEST ID for Admob ads
    AdMobInterstitial.setAdUnitID(AD_UNIT_ID);
    AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
      console.log("interstitialDidLoad")
    );
    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () =>
      console.log("interstitialDidFailToLoad")
    );
    AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
      console.log("interstitialDidOpen")
    );
    AdMobInterstitial.addEventListener("interstitialDidClose", () =>
      console.log("interstitialDidClose")
    );
    AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
      console.log("interstitialWillLeaveApplication")
    );

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("component did update bridge map", prevProps, prevState, snapshot)
    // console.log("coords", this.props.Coords)
    // console.log("warnings", this.props.Warnings)

    if (!!this.props.Coords.length) {
      // console.log("centerin on first co-ords", this.props.Coords[0])
      // this.handleCenter(this.props.Coords[0])
      this.map.fitToCoordinates([this.props.Coords[0], this.props.Coords[this.props.Coords.length-1]], { edgePadding: DEFAULT_PADDING, animated: true })
    }
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
    AdMobInterstitial.removeAllListeners();
  }

  bannerError() {
    console.log("An error");
    return;
  }

  showInterstitial() {
    AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
  }

  checkDistanceFromBridges = (start) => {

    // console.log("bridge props nav ", this.props.navigation.state)

    // const auState = this.props.AustralianState
    // const { state } = this.props.navigation;
    // const currentRouteKey = state.routes[state.index].key;
    // console.log("loc check ", this.props)
    // console.log(this.props.Bridges, this.props.AustralianState);

    // if (!!this.props.Coords.length) {
    //   console.log("centerin on first co-ords", this.props.Coords[0])
    //   // this.handleCenter(this.props.Coords[0])
    //   this.map.fitToCoordinates([this.props.Coords[0], this.props.Coords[this.props.Coords.length-1]], { edgePadding: DEFAULT_PADDING, animated: true })
    // }

    // if (!this.props.Bridges[this.props.AustralianState]) return;
    this.props.Bridges.map((marker, index) => {
        const end = {
          latitude: marker[4],
          longitude: marker[5]
        }
        // console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))
        // console.log("Metres to", marker[1], haversine(start, end, {unit: 'meter'}))
        marker[6] = Math.round(haversine(start, end, {unit: 'meter'}))
        // if (+marker[5] < 8750 && !marker[6]) {
          // if (+marker[5] < 2000 && this.state.alerts.length < 1) {

          // Check if we are near to a bridge.
          if (+marker[6] < this.props.Warnings.radius && marker[7] === false) {
          
          let stateProp = this.props.Bridges[index]
          stateProp[7] = true
          this.setState({stateProp})
          // this.setState({mapWarning: true})
          this.props.setMapAlertVisible(true)
          this.setState({mapWarningMessage: `You are ${marker[6]}m away from\n${marker[1]} [${marker[3]}m]`})

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

          Expo.Notifications.addListener(this.notificationHandler)
          let locationNotificationId = Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
        }
      }
    )

  }

  notificationHandler() {
    console.log("got a notification")
  }

  clearWarning() {
    // this.setState({mapWarning: false});
    this.props.setMapAlertVisible(false);
  }

  handleCenter = ( coord ) => {
    // const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.location;
    this.map.animateToRegion({
      latitude: coord.latitude,
      longitude: coord.longitude,
      latitudeDelta: MAP_DELTA,
      longitudeDelta: MAP_DELTA
    })
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

    // console.log("bridge map render call")

    const currentLatitude = this.state.latitude
    const currentLongitude = this.state.longitude
    // const auState = this.props.AustralianState

    return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        {currentLatitude && currentLongitude &&
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
          showsUserLocation={true}
          followUserLocation={true}
          onLayout={this.onMapLayout}
          ref={map => {this.map = map}}
          key={this.props.VehicleHeight}
        >
          {this.state.isMapReady && this.props.Bridges.map(marker => (
            <View>
              {marker[3] <= (this.props.VehicleHeight / 10) &&
              <MapView.Marker
                key={marker[0]}
                coordinate={{latitude: marker[4], longitude: marker[5]}}
                title={`${marker[1]} ${marker[3]}m`}
                pinColor={"#000000"}
              />
              }
            </View>
          ))}
          {!!this.props.Coords.length && (<View>
            <MapView.Polyline coordinates={this.props.Coords} strokeWidth={2} strokeColor="red" />
          </View>)}
        </MapView>
        }
        {this.props.Warnings.mapalertvisible &&
          <TouchableOpacity onPress={() => this.clearWarning()}>
            <Image source={require('../assets/images/warning.png')} style={styles.warningImage}></Image>
            <Text style={styles.warningMessage}>{this.state.mapWarningMessage}</Text>
          </TouchableOpacity> 
        }
        <View style={styles.heightTab}>
          <Text style={styles.heightTabText}>{this.props.VehicleHeight / 10}m</Text>
        </View>
        <TouchableOpacity onPress={() => this.handleCenter({latitude: this.state.latitude, longitude: this.state.longitude})} style={styles.iconCenter}>
          <Image source={require('../assets/images/Assets.xcassets/icon-center.imageset/center-icon-75.png')} style={styles.iconCenterImage}></Image>
        </TouchableOpacity>
      </View>
      <AdMobBanner
            style={styles.bottomBanner}
            bannerSize="smartBannerPortrait"
            adUnitID={AD_UNIT_ID}
            // Test ID, Replace with your-admob-unit-id
            testDeviceID={AD_DEVICE_ID}
            didFailToReceiveAdWithError={this.bannerError}
        />
    </View>
    )
  }
}

const mapStateToProps = state => {
  // console.log("mapStateToProps on bridge map screen", state, state.Bridges)
  return {Bridges: state.Bridges,
  VehicleHeight: state.VehicleHeight,
  AustralianState: state.AustralianState.austate,
  Coords: state.Coords.coords,
  Screen: state.Screen,
  Warnings: state.Warnings}
}

export default connect(mapStateToProps, actions)(BridgeMapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#acacac'
  },
  mapStyle: {
    flex: 1,
    width,
    height: height - 186,
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
  heightTab: {
    width: 58, 
    height: 55,
    backgroundColor: '#111111', 
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: height - 192 - 48,
    left: 32,
    borderRadius: 10
  },
  heightTabText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16
  },
  warningImage: {
      width: 150,
      height: 150,
      position: 'absolute',
      zIndex: 2,
      top: height - 380,
      left: -75
  },
  warningMessage: {
      position: 'absolute',
      backgroundColor: '#acacac',
      textAlign: 'center',
      top: height - 182,
      fontWeight: 'bold',
      zIndex: 1,
      fontSize: 14,
      left: -90
  },
  iconCenter: {
    position: 'absolute',
    top: height - 176,
    right: 8,
    zIndex: 3,
  },
  iconCenterImage: {
    width: 24,
    height: 24
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  }
})
