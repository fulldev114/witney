import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors, Styles } from '@themes';
import NavigationHeader from '@components/NavigationHeader';
import TabBarComponent from '@components/SecondaryTabBarComponent';
import TabBarIcon from '@components/SecondaryTabBarIcon';
import SocialInstagramScreen from './SocialInstagramScreen';
import SocialTwitterScreen from './SocialTwitterScreen';
import SocialYoutubeScreen from './SocialYoutubeScreen';

const SocialContentsNavigator = TabNavigator({
  socialInstagram: {
    screen: SocialInstagramScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <TabBarIcon icon={'instagram'} tintColor={tintColor} />
      ),
    },
  },
  socialTwitter: {
    screen: SocialTwitterScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <TabBarIcon icon={'twitter'} tintColor={tintColor} />
      ),
    },
  },
  socialYoutube: {
    screen: SocialYoutubeScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <TabBarIcon icon={'youtube'} tintColor={tintColor} />
      ),
    },
  },
}, {
  lazy: true,
  // initialRouteName: 'socialTwitter',
  tabBarPosition: 'top',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarComponent: TabBarComponent,
  tabBarOptions: {
    inactiveTintColor: Colors.transparent,
    activeTintColor: Colors.tabBarTint,
    showIcon: true,
    showLabel: false,
    style: Styles.secondaryTabBar,
    tabStyle: Styles.secondaryTabBarItem,
    indicatorStyle: Styles.secondaryTabBarIndicator,
  },
});

const SocialNavigator = StackNavigator({
  socialContents: {
    screen: SocialContentsNavigator,
    navigationOptions: {
      title: I18n.t('social'),
    },
  },
}, {
  navigationOptions: {
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
    header: props => <NavigationHeader {...props} />,
  },
});

export default SocialNavigator;
