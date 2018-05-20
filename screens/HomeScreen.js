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
  Dimensions
} from 'react-native';
import { Button } from 'react-native-elements';
import { WebBrowser } from 'expo';

import { connect } from 'react-redux';
import * as actions from '../actions';

import Colors from '../constants/Colors';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;


const vehicleImages = [
  require(`../assets/images/vehicles/vehicle-1.png`),
  require(`../assets/images/vehicles/vehicle-2.png`),
  require(`../assets/images/vehicles/vehicle-3.png`),
  require(`../assets/images/vehicles/vehicle-4.png`),
  require(`../assets/images/vehicles/vehicle-5.png`),
  require(`../assets/images/vehicles/vehicle-6.png`),
]


class HomeScreen extends React.Component {

  constructor (props) {
    super(props)

    // NB = we are using integers to count height to avoid floating point precision issues when
    // using the stepping increment controls. Height must be divided down.
    this.state = {
      page: 0,
      // currentHeight: 25,
      currentItemName: 'Car',
      currentItemHeight: 'Car'
    }

    this._onScrollEnd = this._onScrollEnd.bind(this)
    this._onHeightDn = this._onHeightDn.bind(this)
    this._onHeightUp = this._onHeightUp.bind(this)
  }

  static navigationOptions = {
    header: null,
    title: 'Height'
  };

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({page: pageNum})

    this.props.setVehicleHeight(this.props.Vehicles[pageNum].height);

    this.setState({
      currentItemName: this.props.Vehicles[pageNum].title,
      // currentHeight: this.props.Vehicles[pageNum].height,
      // currentItemHeight: this.props.Vehicles[pageNum].height
    })
  }

  _onHeightDn () {
    // this.setState({ currentHeight: parseFloat(this.state.currentHeight - 1) })
    this.props.setVehicleHeight(parseFloat(Math.max(20, this.props.VehicleHeight - 1)))
  }
  _onHeightUp () {
    // this.setState({ currentHeight: parseFloat(this.state.currentHeight + 1) })
    this.props.setVehicleHeight(parseFloat(Math.min(75,this.props.VehicleHeight + 1)))
  }

  _renderVehicle = ({item}) => {

      return (
        <View>
          <Image source={vehicleImages[item.key - 1]} 
          style={{margin: 10, 
                  width: viewportWidth - 20, 
                  alignSelf: 'stretch', 
                  resizeMode: 'contain'}} />
        </View>      
      )

  }

  _startJourney () {
    this.props.navigation.navigate('BridgeMap')
  }

  _pickState ( auState ) {
    console.log("pick state", auState )
    this.props.setAustralianState( auState )
  
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={{marginTop: 10, height: 25}}>Choose a State</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 25}}>
              <Button small rounded title="NSW" onPress={() => this._pickState('NSW')} backgroundColor={(this.props.AustralianState === 'NSW') ? '#333' : '#ccc'}></Button>
              <Button small rounded title="QLD" onPress={() => this._pickState('QLD')} backgroundColor={(this.props.AustralianState === 'QLD') ? '#333' : '#ccc'}></Button>
              <Button small rounded title="VIC" onPress={() => this._pickState('VIC')} backgroundColor={(this.props.AustralianState === 'VIC') ? '#333' : '#ccc'}></Button>
            </View>
            <View style={{width: viewportWidth}}>
              <FlatList
                data={this.props.Vehicles}
                maxSwipeDistance={viewportWidth}
                horizontal={true}
                style={{padding: 0, width: viewportWidth, height: 250}}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this._onScrollEnd}
                renderItem={this._renderVehicle}
                extraData={this.state}
              />
              <Button rounded small title="&lt;" onPress={() => this.setState({selected: this.state.page-1})} style={{position: 'absolute', left: -8, top: -125, fontSize: 16}} color={'#333'} backgroundColor={'#deaf00'}></Button>
              <Button rounded small title="&gt;" onPress={() => this.setState({selected: this.state.page+1})} style={{position: 'absolute', right: -8, top: -125, fontSize: 16}} color={'#333'} backgroundColor={'#deaf00'}></Button>
            </View>
            <Text style={{alignSelf: 'center', color: Colors.red, fontSize: 28, fontWeight: 'bold'}}>{this.state.currentItemName}</Text>
            <View style={{width: viewportWidth * 0.75,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button medium rounded title=" - " onPress={this._onHeightDn} fontSize={30} color={'#000'} backgroundColor={'#fff'}></Button>
              <Text style={{fontSize: 20}}>{this.props.VehicleHeight/10.0}{'m'}</Text>
              <Button medium rounded title=" + " onPress={this._onHeightUp} fontSize={30} color={'#000'} backgroundColor={'#fff'}></Button>
            </View>
            <Button onPress={() => this._startJourney()} medium rounded title="Start" style={{alignSelf: 'center', marginTop: 12, width: '66%'}} color={'#fff'} backgroundColor={'#f00'}></Button>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Routes')}>
              <Text style={{alignSelf: 'center', color: Colors.Black, fontSize: 14, marginTop: 12 }}>Plan My Journey</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const mapStateToProps = state => {
    console.log("mapStateToProps on home screen", state, state.AustralianState)
    return {
      Vehicles: state.Vehicles,
      VehicleHeight: state.VehicleHeight,
      AustralianState: state.AustralianState,
      Route: state.Route,
      Screen: state.Screen
    }
};

export default connect(mapStateToProps, actions)(HomeScreen);

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
    marginBottom: 20,

  },
  image: {
    width: viewportWidth,
    flex: 1
  },
})
