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

import Colors from '../constants/Colors';
// import Layout from '../constants/Layout';
// import Slider from 'react-native-image-slider';
// import Swiper from 'react-native-swiper';
// import Carousel from 'react-native-snap-carousel';
// import ImageSlider from 'react-native-image-slider';


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

const entryBorderRadius = 8;



import { MonoText } from '../components/StyledText';


export default class HomeScreen extends React.Component {

  constructor (props) {
    super(props)

    // NB = we are using integers to count height to avoid floating point precision issues when
    // using the stepping increment controls. Height must be divided down.
    this.state = {
      page: 0,
      currentHeight: 25,
      currentItemName: 'car',
      currentItemHeight: 'car',
      vehicleImages: [
        {key: 1, source: require('../assets/images/vehicles/vehicle-1.png'), title: 'car', height: 25},
        {key: 2, source: require('../assets/images/vehicles/vehicle-2.png'), title: 'camper', height: 30},
        {key: 3, source: require('../assets/images/vehicles/vehicle-3.png'), title: 'coach', height: 32},
        {key: 4, source: require('../assets/images/vehicles/vehicle-4.png'), title: 'van', height: 33},
        {key: 5, source: require('../assets/images/vehicles/vehicle-5.png'), title: 'double-decker', height: 40},
        {key: 6, source: require('../assets/images/vehicles/vehicle-6.png'), title: 'hgv', height: 37}
      ]
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
    this.setState({
      currentItemName: this.state.vehicleImages[pageNum].title,
      currentHeight: this.state.vehicleImages[pageNum].height,
      currentItemHeight: this.state.vehicleImages[pageNum].height
    })
    console.log('scrolled to page ', pageNum, this.state.page);
  }

  _onHeightDn () {
    this.setState({ currentHeight: parseFloat(this.state.currentHeight - 1) })
  }
  _onHeightUp () {
    this.setState({ currentHeight: parseFloat(this.state.currentHeight + 1) })
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/bridge-alert-logo.png')}
              style={styles.welcomeImage}
            />
            <Text style={{marginTop: 0, fontSize: 24}}>Swipe to select vehicle</Text>
            <View style={{width: viewportWidth}}>
              <FlatList
                data={this.state.vehicleImages}
                maxSwipeDistance={viewportWidth}
                horizontal={true}
                style={{padding: 0, width: viewportWidth, minHeight: 270}}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this._onScrollEnd}
                renderItem={({item}) => (
                  <View>
                    <Image source={item.source} style={{margin: 10, width: viewportWidth - 20, alignSelf: 'stretch', resizeMode: 'contain'}}></Image>
                  </View>
                  )
                }
              />
            </View>
            <View style={{width: viewportWidth * 0.75,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button medium rounded title="-" onPress={this._onHeightDn} color={'#000'} backgroundColor={'#fff'}></Button>
              <Text style={{fontSize: 20}}>{this.state.currentHeight/10.0}{'m'}</Text>
              <Button medium rounded title="+" onPress={this._onHeightUp} color={'#000'} backgroundColor={'#fff'}></Button>
            </View>
            <Text style={{alignSelf: 'center', color: Colors.red}}>{this.state.currentItemName}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc0',
    justifyContent: 'space-between'
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    // resizeMode: 'cover',
    // borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,
    width: viewportWidth,
    flex: 1
  },
  // image's border radius is buggy on ios; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: Colors.black
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: Colors.black
  },
  title: {
    color: Colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: Colors.gray,
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
});
