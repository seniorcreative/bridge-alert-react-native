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
  Slider,
  Switch
} from 'react-native';
import { Button } from 'react-native-elements';
import { Linking } from 'react-native'

import Colors from '../constants/Colors';
import { connect } from 'react-redux'
import * as actions from '../actions'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
  };

  _onSliderChange (value ) {
    console.log("slider", value)
    this.props.setWarningRadius(value)
  }

  _onSwitchChange (value ) {
    console.log("switch", value)
    this.props.setWarningVisible(value)
  }

  _handleFBPress = () => {
    Linking.openURL('https://facebook.com/bridgealert');
  }

  _handleTWPress = () => {
    Linking.openURL('https://twitter.com/bridgealert');
  }

  _handleWebPress = () => {
    Linking.openURL('http://bridge-alert.com');
  }

  _pickState ( auState ) {
    this.props.setAustralianState( auState )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
        <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 28, marginTop: 15, marginBottom: 10, fontWeight: 'bold'}}>Settings</Text>
        <Text style={{marginTop: 10, height: 25, alignSelf: 'center'}}>Selected State</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 75}}>
            <Button small rounded title="VIC" onPress={() => this._pickState('VIC')} backgroundColor={(this.props.AustralianState === 'VIC') ? '#333' : '#ccc'}></Button>
            <Button small rounded title="NSW" onPress={() => this._pickState('NSW')} backgroundColor={(this.props.AustralianState === 'NSW') ? '#333' : '#ccc'}></Button>
            <Button small rounded title="QLD" onPress={() => this._pickState('QLD')} backgroundColor={(this.props.AustralianState === 'QLD') ? '#333' : '#ccc'}></Button>
          </View>
        <View style={styles.switcher}>
          <Text>Show warning regions</Text>
          <Switch value={this.props.Warnings.visible} onTintColor={'#f00'} onValueChange={(value) => this._onSwitchChange(value)}/>
        </View>
        {!!this.props.Warnings.visible &&
        <View style={{height: 125}}>
          <Text style={{alignSelf: 'left', marginLeft: 10}}>Set size of warning radius (m)</Text>
          <Slider style={styles.slider} minimumTrackTintColor={'#f00'} step={1} maximumValue={750} minimumValue={50} value={100} onValueChange={(value) => this._onSliderChange(value)}/>
          <View style={styles.sliderContainer}>
            <Text>50m</Text>
            <Text style={{fontWeight: 'bold'}}>{this.props.Warnings.radius}m</Text>
            <Text>750m</Text>
          </View>
        </View>}
        <ScrollView style={{height: 100, margin: 10}}>
            <Text>Use this app with a co-driver, or plan your journey ahead. Do not use apps while driving. We currently only have data for VIC, QLD and NSW.</Text>
        </ScrollView>
        <View style={styles.socialIconContainer}>
          <TouchableOpacity onPress={this._handleFBPress} >
            <Image source={require('../assets/images/social-facebook.png')} style={styles.socialIcon}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleTWPress} >
            <Image source={require('../assets/images/social-twitter.png')} style={styles.socialIcon}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleWebPress} >
            <Text>&copy;{new Date().getFullYear()} bridge-alert.com</Text>
          </TouchableOpacity>
        </View>
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
  Screen: state.Screen,
  Warnings: state.Warnings}
}

export default connect(mapStateToProps, actions)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc0',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  image: {
    width: viewportWidth,
    flex: 1
  },
  slider: {
    width: viewportWidth - 20,
    height: 40,
    margin: 10
  },
  sliderContainer: {
    flex: 1, 
    flexDirection: 'row', 
    marginLeft: 10, 
    marginRight: 10, 
    justifyContent: 'space-between'
  },
  switcher: {
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginLeft: 10,
    marginBottom: 20
  },
  socialIconContainer: {
    fleX: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  socialIcon: {
    width: 32,
    height: 32,
    margin: 10
  }
})
