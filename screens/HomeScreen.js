import React from 'react';
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  ScrollView
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  AdMobBanner,
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
// const AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111'; // TEST ID
const AD_UNIT_ID = 'ca-app-pub-5368979163797748/1999912385'; // HOME SCREEN ID
// const AD_DEVICE_ID = 'EMULATOR'; // TEST DEVICE ID
// const AD_DEVICE_ID = 'APP'; // LIVE DEVICE ID

const vehicleImages = [
  require(`../assets/images/vehicles/ba-vehicle-1.png`),
  require(`../assets/images/vehicles/ba-vehicle-2.png`),
  require(`../assets/images/vehicles/ba-vehicle-3.png`),
  require(`../assets/images/vehicles/ba-vehicle-4.png`),
  require(`../assets/images/vehicles/ba-vehicle-5.png`),
  require(`../assets/images/vehicles/ba-vehicle-6.png`),
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
      currentItemHeight: 'Car',
      modalVisible: false,
      termsAgreed: false
    }

    this._onScrollEnd = this._onScrollEnd.bind(this)
    this._onHeightDn = this._onHeightDn.bind(this)
    this._onHeightUp = this._onHeightUp.bind(this)

  }

  static navigationOptions = {
    header: null,
    title: 'Height'
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  setTermsAgreed(agreed) {
    this.setState({termsAgreed: agreed})
  }

  componentDidMount() {
    this.setModalVisible(true)
    this.props.fetchData();
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
                  resizeMode: 'contain' 
                  // transform: this.state.direction === 'r2l' ? [{scaleX:1}] : [{scaleX:-1}]
          }} />
        </View>      
      )

  }

  _startJourney () {
    this.props.navigation.navigate('BridgeMap')
  }

  render() {
    return (
      <View style={styles.container}>
          <AdMobBanner
            style={styles.topBanner}
            bannerSize="smartBannerPortrait"
            adUnitID={AD_UNIT_ID}
            // Test ID, Replace with your-admob-unit-id
            // testDeviceID={AD_DEVICE_ID}
            didFailToReceiveAdWithError={this.bannerError}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <View style={styles.modalViewInner}>
              <View>
                <Text style={styles.modalHeading}>Terms of Use</Text>
                <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalPara}>{this.props.Content.termsOfUse}</Text>
    <Button onPress={() => {this.setModalVisible(!this.state.modalVisible);this.setTermsAgreed(true)}} medium rounded title={!this.props.Bridges || !this.props.Bridges.length ? "Initializing" : "I agree"}  
                style={{alignSelf: 'center', marginTop: 0, width: '66%'}}
                color={'#fff'} backgroundColor={'#f00'} loading={!this.props.Bridges || !this.props.Bridges.length}></Button>
                </ScrollView>
              </View>
            </View>
          </Modal>
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
                keyExtractor={(item) => item.key.toString() }
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
            <Button onPress={() => this._startJourney()} medium rounded title={!this.props.Bridges || !this.props.Bridges.length ? "Initializing" : "Start"} 
            style={{alignSelf: 'center', marginTop: 0, width: '66%'}}
            color={'#fff'} backgroundColor={'#f00'} loading={!this.props.Bridges || !this.props.Bridges.length}></Button>
            {!!this.props.Bridges && !!this.props.Bridges.length && (
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Height')}>
                <Text style={{alignSelf: 'center', color: Colors.Black, fontSize: 14, marginTop: 10 }} disabled={!this.props.Bridges || !this.props.Bridges.length}>Plan My Route</Text>
              </TouchableOpacity>
              )
            }
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
}

const mapStateToProps = state => {
    // console.log("mapStateToProps on home screen", state, state.AustralianState)
    return {
      Vehicles: state.Vehicles,
      VehicleHeight: state.VehicleHeight,
      AustralianState: state.AustralianState.austate,
      Coords: state.Coords.coords,
      Screen: state.Screen,
      Bridges: state.FirebaseData.data.bridges,
      Content: state.FirebaseData.data.content,
      Settings: state.FirebaseData.data.settings
    }
};

const mapDispatchToProps = (dispatch) => {
  return { };
 }

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
    marginTop: 40,
    marginBottom: 10,
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
  },
  modalViewInner: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fc0'
  },
  modalHeading: {
    marginTop: 30,
    marginBottom: 25,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalPara: {
    lineHeight: 20,
    marginBottom: 20
  },
  modalScrollView: {
    flex: 0,
    height: viewportHeight * 0.67
  }
});


