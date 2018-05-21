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
import Polyline from '@mapbox/polyline'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

// start (532 barrabool rd)
// -38.1707008,144.2724222

// end - moriac somewhere
// -38.2646152,144.1676303

const PLACES_KEY = 'AIzaSyA2MxBrJqIfIs4DxCh65_bwkxk1Ic0QXRU'

import { Button } from 'react-native-elements'
import Colors from '../constants/Colors'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <View style={{width: 250, height: 350, marginTop: 20, marginBottom: 20}}>
            <Text>Enter a start location</Text>
            <GooglePlacesAutocomplete
              placeholder='Start location'
              minLength={3} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'    // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                console.log("start", details.geometry.location);
                this.setState({startLocation: details.geometry.location})
              }}
              
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: PLACES_KEY,
                language: 'en', // language of the results
                // types: '(cities)' // default: 'geocode'
              }}
              
              styles={{
                textInputContainer: {
                  width: '100%'
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
              //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              //   rankby: 'distance',
              //   types: 'food'
              // }}

              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
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
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                console.log("end", details.geometry.location);
                this.setState({endLocation: details.geometry.location})
              }}
              
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: PLACES_KEY,
                language: 'en', // language of the results
                // types: '(cities)' // default: 'geocode'
              }}
              
              styles={{
                textInputContainer: {
                  width: '100%'
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
              //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              //   rankby: 'distance',
              //   types: 'food'
              // }}

              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={()  => <Image source={require('../assets/images/Assets.xcassets/icon-reset.imageset/Reset-Tab-Image@3x.png')} />}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
          </View>
          <Button large rounded title="Start Journey" onPress={() => this.showRouteOnMap()} color={'#fff'} backgroundColor={'#f00'}></Button>
        </View>
      </View>
    )
  }

}

const mapStateToProps = state => {
  // console.log("mapStateToProps on bridge map screen", state, state.Bridges)
  return {Bridges: state.Bridges,
  VehicleHeight: state.VehicleHeight,
  AustralianState: state.AustralianState,
  Coords: state.Coords,
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
    marginTop: 0,
    marginBottom: 20
  },
  image: {
    width: viewportWidth,
    flex: 1
  },
})
