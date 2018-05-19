import React from 'react';
import { Image, Dimensions } from 'react-native';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const SharedHeader = (props) => {
  const {headerStyle} = styles;

  return (
    <Image source={require('../assets/images/bridge-alert-logo-rn.png')} style={headerStyle} />
  )
}

const styles = {
  headerStyle: {
    width: viewportWidth,
    height: 96,
    resizeMode: 'cover',
    marginTop: 0
  },
}

export default SharedHeader;