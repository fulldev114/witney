import React, { Component } from 'react';
import { View, Image, Platform } from 'react-native';
import { Metrics } from '@themes';

const styles = {
  container: {
    justifyContent: 'center',
    height: Metrics.tabBarHeight,
  },
  border: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : -3,
    width: 38,
    left: -8,
    height: Platform.OS === 'android' ? 4 : 6,
    borderRadius: 3,
  },
  icon: {
    width: 23,
    height: 23,
  },
};

class TabBarIcon extends Component {
  render() {
    const { icon, tintColor } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.border, { backgroundColor: tintColor }]} />
        <Image source={icon.source} style={styles.icon} />
      </View>
    );
  }
}

export default TabBarIcon;
