import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import firebase from 'react-native-firebase';

import { Colors, Styles } from '@themes';
import AppHelper from '@helpers/AppHelper';

import IntroScreen from './IntroScreen';
import LoginScreen from './LoginScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import RegisterScreen from './RegisterScreen';
import PlanScreen from './PlanScreen';
import WebViewScreen from './WebViewScreen';
import MainScreen from './MainScreen';

// Firebase Messaging
const FCM = firebase.messaging();
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const settings = await AppHelper.getSettings(user);
    if (settings.notifications.general__new_video_alert || settings.notifications.general__motivation_reminders) {
      FCM.requestPermissions();
    }
  }
});

const MainNavigator = StackNavigator({
  intro: {
    screen: IntroScreen,
  },
  login: {
    screen: LoginScreen,
  },
  forgotPassword: {
    screen: ForgotPasswordScreen,
  },
  register: {
    screen: RegisterScreen,
  },
  plan: {
    screen: PlanScreen,
  },
  description: {
    screen: WebViewScreen,
  },
  main: {
    screen: ({ navigation }) => <MainScreen screenProps={{ rootNavigation: navigation }} />,
  },
}, {
  lazy: true,
  initialRouteName: 'intro',
  navigationOptions: {
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
    header: null,
    headerBackTitle: null,
  },
});

class Main extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <MainNavigator />
        <DropdownAlert ref={(ref) => { this.alertRef = ref; }} />
      </View>
    );
  }
}

export default Main;
