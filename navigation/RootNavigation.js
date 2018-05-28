import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    },
  },
  {
    navigationOptions: () => ({
      // title:'Bridge Alert',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
    cardStyle: { shadowColor: 'transparent' }
  }
);

export default class RootNavigator extends React.Component {
  
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator
      onNavigationStateChange={(prevState, currentState) => {
        // console.log("Changed nav", prevState.routes[0].index, currentState.routes[0].index)
        // currentState.routes[0].routes[currentState.routes[0].index].params = {xxx: 'xxx'}
        // console.log("Changed nav current state", currentState)
      }}
    />
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    // console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}
