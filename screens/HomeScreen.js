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
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded
} from "expo";

import { connect } from 'react-redux';
import * as actions from '../actions';

import Colors from '../constants/Colors';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.25;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const AD_UNIT_ID = 'ca-app-pub-5368979163797748/5946924506'; // LIVE ID


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
      direction: 'r2l',
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

  componentDidMount() {
    // this.list.getItemLayout = () => {
    setTimeout(() => {this.setListPage(1)}, 500)
    // }
    AdMobInterstitial.setTestDeviceID("EMULATOR");
    // ALWAYS USE TEST ID for Admob ads
    AdMobInterstitial.setAdUnitID("ca-app-pub3940256099942544/1033173712");
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

  showInterstitial() {
    AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({page: pageNum})

    this.props.setVehicleHeight(this.props.Vehicles[pageNum].height);

    this.setState({
      currentItemName: this.props.Vehicles[pageNum].title
    })
  }

  setListPage(page, direction) {
    // this.setState({selected: this.state.page+1}
    console.log('set list page', page)
    let pageRanged = Math.max(0, Math.min(5, page))
    this.setState({ page: pageRanged })
    this.setState({direction})
    this.list.scrollToIndex({ index: pageRanged, animated: true })
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
          style={{marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20, 
                  width: viewportWidth - 40, 
                  height: 120,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  transform: this.state.direction === 'r2l' ? [{scaleX:1}] : [{scaleX:-1}]}} />
        </View>      
      )

  }

  _startJourney () {
    this.props.navigation.navigate('BridgeMap')
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 25, marginTop: 10, marginBottom: 0, fontWeight: 'bold'}}>Set Vehicle Height</Text>
            <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 18, marginTop: 5, marginBottom: 0, }}>Swipe for more vehicles</Text>
            <View style={{width: viewportWidth}}>
              <FlatList
                data={this.props.Vehicles}
                maxSwipeDistance={viewportWidth}
                horizontal={true}
                style={{padding: 0, width: viewportWidth, height: 150, marginTop: 0}}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this._onScrollEnd}
                renderItem={this._renderVehicle}
                extraData={this.state}
                ref={list => {this.list = list}}
                onScroll={(event) => {
                  var currentOffset = event.nativeEvent.contentOffset.x
                  var direction = currentOffset > this.offset ? 'r2l' : 'l2r';
                  this.offset = currentOffset;
                  this.setState({direction});
                }}
                getItemLayout={(data, index) => (
                  {length: sliderWidth, offset: sliderWidth * index, index}
                )}
              />
              {/* <View>
              {(this.state.page > 100 &&
                <Button rounded small title="&lt;" onPress={() => this.setListPage(this.state.page-1, 'l2r')} style={{position: 'absolute', left: -8, top: -125, fontSize: 16}} color={'#333'} backgroundColor={'#deaf00'}></Button>
              )}
              {(this.state.page < 0 &&
                <Button rounded small title="&gt;" onPress={() => this.setListPage(this.state.page+1, 'r2l')} style={{position: 'absolute', right: -8, top: -125, fontSize: 16}} color={'#333'} backgroundColor={'#deaf00'}></Button>
              )}
              </View> */}
              </View>
            <Text style={{alignSelf: 'center', color: Colors.red, fontSize: 28, fontWeight: 'bold'}}>{this.state.currentItemName}</Text>
            <View style={{width: viewportWidth * 0.75,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button medium rounded title=" - " onPress={this._onHeightDn} fontSize={28} color={'#000'} backgroundColor={'#fff'}></Button>
              <Text style={{fontSize: 20}}>{this.props.VehicleHeight/10.0}{'m'}</Text>
              <Button medium rounded title=" + " onPress={this._onHeightUp} fontSize={28} color={'#000'} backgroundColor={'#fff'}></Button>
            </View>
            <Button onPress={() => this._startJourney()} medium rounded title="Start" style={{alignSelf: 'center', marginTop: 0, width: '66%'}} color={'#fff'} backgroundColor={'#f00'}></Button>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Routes')}>
              <Text style={{alignSelf: 'center', color: Colors.Black, fontSize: 14, marginTop: 6 }}>Plan My Route</Text>
            </TouchableOpacity>
          </View>
          <AdMobBanner
            style={styles.bottomBanner}
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            didFailToReceiveAdWithError={this.bannerError}
          />
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
      AustralianState: state.AustralianState.austate,
      Coords: state.Coords.coords,
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
    marginBottom: 10,

  },
  image: {
    width: viewportWidth,
    flex: 1
  },
  topBanner: {
    position: "absolute",
    top: 0,
    width: viewportWidth
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  }
})
