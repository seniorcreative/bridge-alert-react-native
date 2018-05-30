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

  render() {
    return (
      <View style={styles.container}>
        <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 28, marginTop: 30, marginBottom: 20, fontWeight: 'bold'}}>Settings</Text>
        <View style={styles.switcher}>
          <Text>Show warning regions</Text>
          <Switch value={this.props.Warnings.visible} onTintColor={'#f00'} onValueChange={(value) => this._onSwitchChange(value)}/>
        </View>
        {!!this.props.Warnings.visible &&
        <View style={{height: 200}}>
          <Text style={{alignSelf: 'left', marginLeft: 10}}>Set size of warning radius (m)</Text>
          <Slider style={styles.slider} minimumTrackTintColor={'#f00'} step={1} maximumValue={750} minimumValue={50} value={100} onValueChange={(value) => this._onSliderChange(value)}/>
          <View style={styles.sliderContainer}>
            <Text>50m</Text>
            <Text style={{fontWeight: 'bold'}}>{this.props.Warnings.radius}m</Text>
            <Text>750m</Text>
          </View>
        </View>}
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
  }
})
