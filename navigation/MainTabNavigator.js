import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import BridgeMapScreen from '../screens/BridgeMapScreen';
import RouteScreen from '../screens/RouteScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    Height: {
      screen: HomeScreen,
    },
    BridgeMap: {
      screen: BridgeMapScreen,
    },
    Routes: {
      screen: RouteScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Height':
            iconName =
              Platform.OS === 'ios'
                ? `ios-car${focused ? '' : '-outline'}`
                : 'md-car';
            break;
          case 'BridgeMap':
            iconName = Platform.OS === 'ios' ? `ios-navigate${focused ? '' : '-outline'}` : 'md-navigate';
            break;
          case 'Routes':
            iconName = Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map';
            break;
          case 'Settings':
            iconName =
              Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 14
      },
      activeTintColor: '#fc0',
      inactiveTintColor: '#ddd',
      style: {
        backgroundColor: '#2c2c2c',
      }
    }
  }
);
