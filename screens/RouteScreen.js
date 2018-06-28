import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  SwipeableFlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import {
  AdMobBanner,
  AdMobInterstitial,
} from "expo";
import Polyline from '@mapbox/polyline'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

// start (532 barrabool rd)
// -38.1707008,144.2724222

// end - moriac somewhere
// -38.2646152,144.1676303

// const PLACES_KEY = 'AIzaSyA2MxBrJqIfIs4DxCh65_bwkxk1Ic0QXRU'
// const PLACES_KEY = 'AIzaSyBeJQwEC93rTtWc5p1y7_H481kYyKlSirw'
const PLACES_KEY = 'AIzaSyD9F3nt6IcRrok2Ewi4ou3WO2oXRVPgjHw' // Android key

import { Button } from 'react-native-elements'
import Colors from '../constants/Colors'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
// const AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111'; // TEST ID
const AD_UNIT_ID = 'ca-app-pub-5368979163797748/1915742789'; // ROUTE SCREEN ID
const AD_DEVICE_ID = 'EMULATOR'; // TEST DEVICE ID
// const AD_DEVICE_ID = 'APP'; // LIVE DEVICE ID

class RouteScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      startAddress: '',
      startLocation: {lat: null, lng: null},
      endAddress: '',
      endLocation: {lat: null, lng: null},
    }

  }

  static navigationOptions = {
    header: null,
    title: 'Route',
  }

  async getDirections(startLoc, destinationLoc) {
    const { navigate } = this.props.navigation;
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
      this.props.setCoords(coords) // Save coords in redux state object
      navigate('BridgeMap')
      // return coords
    } catch(error) {
      console.log('error getting coords', error)
      return error
    }
  }

  showRouteOnMap () {
    // This func needs to take the autocomplete start and end lat and long
    // from the two inputs.
    this.getDirections(`${this.state.startLocation.lat},${this.state.startLocation.lng}`,`${this.state.endLocation.lat},${this.state.endLocation.lng}`)
  }

  resetRoute () {
    this.setState({
      startAddress: '',
      startLocation: {lat: null, lng: null},
      endAddress: '',
      endLocation: {lat: null, lng: null},
    })
    this.startAddress.setAddressText('')
    this.endAddress.setAddressText('')
    this.props.setCoords({coords: []})
  }

  componentDidMount() {
    AdMobInterstitial.setTestDeviceID(AD_DEVICE_ID);
    // ALWAYS USE TEST ID for Admob ads
    // AdMobInterstitial.setAdUnitID(AD_UNIT_ID);
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

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  bannerError() {
    console.log("An error");
    return;
  }

  render() {
    return (
      <View style={styles.container}>
        <AdMobBanner
            style={styles.topBanner}
            bannerSize="smartBannerPortrait"
            adUnitID={AD_UNIT_ID}
            // Test ID, Replace with your-admob-unit-id
            testDeviceID={AD_DEVICE_ID}
            didFailToReceiveAdWithError={this.bannerError}
        />
        <View style={styles.welcomeContainer}>
          {/* <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 28, marginTop: 15, marginBottom: 10, fontWeight: 'bold'}}>Route</Text> */}
          <View style={{width: '90%', height: 275, marginTop: 15, marginBottom: 20}}>
            <Text>Enter a start location</Text>
            <GooglePlacesAutocomplete
              placeholder='Start location'
              minLength={3} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'    // true/false/undefined
              fetchDetails={true}
              // renderDescription={row => row.description} // custom description render
              renderDescription={row => row.description || row.formatted_address || row.name}
              ref={startAddress => {this.startAddress = startAddress}}
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                // console.log("start addy", data, details);
                for (let a in details.address_components) {
                  const { types } = details.address_components[a], stateKey = 'administrative_area_level_1'
                  // console.log('types', types)
                  if (types.indexOf(stateKey) !== -1) {
                    // console.log("State is ", details.address_components[a].short_name)
                    this.props.setAustralianState( details.address_components[a].short_name )
                  }
                }
                this.setState({
                  startAddress: data.description,
                  startLocation: details.geometry.location
                })
              }}
              
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: PLACES_KEY,
                language: 'en', // language of the results
                components: 'country:au' // Only Australia
                // types: '(cities)' // default: 'geocode'
              }}
              
              styles={{
                textInputContainer: {
                  width: '100%',
                  backgroundColor: '#fc0',
                },
                backgroundColor: '#fc0',
                description: {
                  fontWeight: 'bold'
                },
                loader: {
                  position: 'absolute',
                  top: 200,
                  left: 100,
                  backgroundColor: '#ff0000'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
                marginBottom: 20
              }}
              
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Use current location"
              nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              // GoogleReverseGeocodingQuery={{
              //   // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              // }}
              // GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                // rankby: 'distance',
                // types: 'food'
                // region: 'au'
              // }}

              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={()  => <Image source={require('../assets/images/Assets.xcassets/icon-reset.imageset/Reset-Tab-Image@3x.png')} />}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
            <Text>Enter a finish location</Text>
            <GooglePlacesAutocomplete
              placeholder='Finish location'
              minLength={3} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'    // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              ref={endAddress => {this.endAddress = endAddress}}
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                // console.log("end", data, details.geometry.location)
                this.setState({
                  endAddress: data.description,
                  endLocation: details.geometry.location
                })
              }}
              
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: PLACES_KEY,
                language: 'en', // language of the results
                components: 'country:au'
                // types: '(cities)' // default: 'geocode'
              }}
              
              styles={{
                textInputContainer: {
                  width: '100%',
                  backgroundColor: '#fc0'
                },
                description: {
                  fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }
              }}
              
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Current location"
              // nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              // GoogleReverseGeocodingQuery={{
              //   // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              // }}
              // GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                // rankby: 'distance',
                // types: 'food'
                // components: 'country:au'
              // }}

              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={()  => <Image source={require('../assets/images/Assets.xcassets/icon-reset.imageset/Reset-Tab-Image@3x.png')} />}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
          </View>
          <Button medium rounded title="Show Route on Bridge Map" onPress={() => this.showRouteOnMap()} disabled={this.state.startAddress === '' || this.state.endAddress === ''} color={'#fff'} backgroundColor={'#f00'}></Button>
          <TouchableOpacity onPress={() => this.resetRoute()} disabled={this.state.startAddress === '' || this.state.endAddress === ''}>
            <Text style={{alignSelf: 'center', color: Colors.Black, fontSize: 14, marginTop: 12 }}>Clear Route</Text>
          </TouchableOpacity>
        </View>
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
  Screen: state.Screen}
}

export default connect(mapStateToProps, actions)(RouteScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc0'
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
    marginTop: 40,
    marginBottom: 20
  },
  image: {
    width: viewportWidth,
    flex: 1
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  },
  topBanner: {
    position: "absolute",
    top: 0
  }
})
