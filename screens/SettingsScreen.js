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

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class RouteScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
  };

  _onSliderChange (value ) {
    console.log("slider", value)
  }

  _onSwitchChange (value ) {
    console.log("switch", value)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={{alignSelf: 'center', color: Colors.black, fontSize: 28, marginTop: 30, marginBottom: 20, fontWeight: 'bold'}}>Settings</Text>
          <Text style={{alignSelf: 'left', marginLeft: 10}}>Set size of warning radius (m)</Text>
          <Slider style={styles.slider} minimumTrackTintColor={'#f00'} step={1} maximumValue={750} minimumValue={50} value={100} onValueChange={(value) => this._onSliderChange(value)}/>
          <Text style={{alignSelf: 'left', marginLeft: 10}}>Show warning regions</Text>
          <Switch value={false} onTintColor={'#f00'} onValueChange={(value) => this._onSwitchChange(value)}/>
        </View>
      </View>
    )
  }

}

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
  slider: {
    width: viewportWidth - 20,
    height: 50
  }
})
