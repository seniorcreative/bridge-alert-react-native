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

// start (532 barrabool rd)
// -38.1707008,144.2724222

// end - moriac somewhere
// -38.2646152,144.1676303

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
    console.log('getDirections', startLoc, destinationLoc)
    const { navigate } = this.props.navigation;
    try {
      console.log('trying')
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return  {
          latitude : point[0],
          longitude : point[1]
        }
      })
      console.log('got coords', coords)
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
    this.getDirections('-38.1707008,144.2724222','-38.2646152,144.1676303')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <View style={{marginTop: 20, marginBottom: 20}}>
            <Text>Enter a start address</Text>
            <TextInput
              style={{height: 40, width: viewportWidth / 1.5, backgroundColor: 'white', borderRadius: 10, padding: 5}}
              onChangeText={(startAddress) => this.setState({startAddress})}
              value={this.state.startAddress} />
          </View>
          <View style={{marginBottom: 20}}>
            <Text>Enter an end address</Text>
            <TextInput
              style={{height: 40, width: viewportWidth / 1.5,  backgroundColor: 'white', borderRadius: 10, padding: 5}}
              onChangeText={(endAddress) => this.setState({endAddress})}
              value={this.state.endAddress} />
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
