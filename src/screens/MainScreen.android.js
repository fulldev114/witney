import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import TabBarIcon from '@components/TabBarIcon';
import { Colors, Images, Styles } from '@themes';

import HomeScreen from './HomeScreen';
import SocialScreen from './SocialScreen';
import VideoMainScreen from './VideoMainScreen';
import FavoriteScreen from './FavoriteScreen';
import SettingsScreen from './SettingsScreen';


const MainScreen = TabNavigator({
  home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon icon={Images.iconHome} focused={focused} tintColor={tintColor} />
      ),
    },
  },
  social: {
    screen: SocialScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon icon={Images.iconComment} focused={focused} tintColor={tintColor} />
      ),
    },
  },
  videoMain: {
    screen: VideoMainScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon icon={Images.iconPlayAndroid} focused={focused} tintColor={tintColor} />
      ),
    },
  },
  favoriteMain: {
    screen: FavoriteScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon icon={Images.iconFolder} focused={focused} tintColor={tintColor} />
      ),
    },
  },
  settingsMain: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon icon={Images.iconSetting} focused={focused} tintColor={tintColor} />
      ),
    },
  },
}, {
  lazy: true,
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarComponent: props => <TabBarBottom {...props} />,
  tabBarOptions: {
    inactiveTintColor: Colors.transparent,
    activeTintColor: Colors.tabBarTint,
    showIcon: true,
    showLabel: false,
    style: Styles.tabBar,
    tabStyle: Styles.tabBarItem,
  },
});

export default MainScreen;
