import React from 'react';
import { StackNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors, Styles } from '@themes';
import NavigationHeader from '@components/NavigationHeader';

import VideoCategoriesScreen from './VideoCategoriesScreen';
import VideoCategoryScreen from './VideoCategoryScreen';

const VideoMainScreen = StackNavigator({
  videoCategories: {
    screen: VideoCategoriesScreen,
    navigationOptions: {
      title: I18n.t('categories'),
    },
  },
  videoCategory: {
    screen: VideoCategoryScreen,
  },
}, {
  navigationOptions: {
    headerBackTitle: null,
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
    header: props => <NavigationHeader {...props} />,
  },
});

export default VideoMainScreen;
