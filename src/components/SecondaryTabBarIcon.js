import React, { Component } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Colors, Fonts, Metrics } from '@themes';

const styles = {
  container: {
    justifyContent: 'center',
    height: Metrics.secondaryTabBarHeight,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    width: Metrics.tabBarBorderWidth,
    height: 6,
    left: -10,
    borderRadius: 3,
  },
  icon: {
    color: Colors.text,
    fontSize: Fonts.size.h5,
    width: 23,
    height: 23,
  },
};

class TabBarIcon extends Component {
  render() {
    const { icon, tintColor } = this.props;
    return (
      <View style={styles.container}>
        <FontAwesome name={icon} style={styles.icon} />
        <View style={[styles.border, { backgroundColor: tintColor }]} />
      </View>
    );
  }
}

export default TabBarIcon;
