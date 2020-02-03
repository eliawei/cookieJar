import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import HomeScreen from './src/components/HomeScreen';
import SignInScreen from './src/components/auth/SignInScreen';
import AuthLoadingScreen from './src/components/auth/AuthLoadingScreen';

import SnackListScreen from './src/components/SnackList';
import SettingsScreen from './src/components/settings/SettingsScreen';
import ProfileScreen from './src/components/settings/ProfileScreen';
import SnacksScreen from './src/components/settings/SnacksScreen';
import SnackInfoScreen from './src/components/settings/SnackInfoScreen';
import ScannerScreen from './src/components/ScannerScreen';

const AppStack = createStackNavigator({
  // Home: HomeScreen,
  SnackList: {
    screen: SnackListScreen,
    navigationOptions: {  
      header: null
    }
  },
  Scanner: {
    screen: ScannerScreen,
    navigationOptions: {
      header: null
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings'
    }
  },
  ProfileSettings: {
    screen: ProfileScreen,
    navigationOptions: {
      header: null,
    }
  },
  SnacksSettings: {
    screen: SnacksScreen,
    navigationOptions: {
      header: null,
    }
  },
  SnackInfoSettings: {
    screen: SnackInfoScreen,
    navigationOptions: {
      header: null
    }
  }
}, {
  initialRouteName: 'SnackList'
});
const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {  
      header: null
    }
  }
});

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack
  }, {
    // initialRouteName: 'AuthLoading'
    initialRouteName: 'App'
  })
);