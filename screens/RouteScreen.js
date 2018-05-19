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
} from 'react-native';

import { Button } from 'react-native-elements';

import Colors from '../constants/Colors';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class RouteScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      startAddress: '',
      startLocation: {lat: null, lng: null},
      endAddress: '',
      endLocation: {lat: null, lng: null},
      coords: {}
    }


  }
  static navigationOptions = {
    header: null,
    title: 'Route',
  };

  render() {

    const { navigate } = this.props.navigation;
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
          <Button large rounded title="Start Journey" onPress={() => navigate('BridgeMap')} color={'#fff'} backgroundColor={'#f00'}></Button>
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
})
