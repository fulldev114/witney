import React, { Component } from 'react';
import { View, Image } from 'react-native';

const styles = {
  container: {
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: -6,
    width: 59,
    left: -16,
    height: 59,
    borderRadius: 30,
  },
  icon: {
    width: 27,
    height: 27,
  },
};

class TabBarIcon extends Component {
  render() {
    const { icon, focused, tintColor } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.background, { backgroundColor: tintColor }]} />
        <Image source={focused ? icon.active.source : icon.inactive.source} style={styles.icon} />
      </View>
    );
  }
}

export default TabBarIcon;
