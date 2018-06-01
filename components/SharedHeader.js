import React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux'
import * as actions from '../actions'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const SharedHeader = (props) => {
  const {headerStyle, warningHeaderImage} = styles;

  return (
    <View>
      {props.Warnings.mapalertvisible && 
      (<Image source={require('../assets/images/Warning-Yellow.png')} style={warningHeaderImage} />)
      }
      <Image source={require('../assets/images/bridge-alert-logo-rn.png')} style={headerStyle} />
    </View>
  )
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

export default connect(mapStateToProps, actions)(SharedHeader);

const styles = {
  headerStyle: {
    width: viewportWidth,
    height: 96,
    resizeMode: 'cover',
    marginTop: 0
  },
  warningHeaderImage: {
      width: 262,
      height: 64,
      position: 'absolute',
      zIndex: 2,
      top: 32,
      alignSelf: 'center'
  }
}