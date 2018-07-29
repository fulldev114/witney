import React, { Component } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TabBarBottom } from 'react-navigation';

import { Colors, Styles } from '@themes';

const styles = {
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 3,
    width: '100%',
  },
};
class SecondaryTabBarComponent extends Component {
  render() {
    return (
      <View style={Styles.backgroundDefault}>
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
          colors={[Colors.gradientHeader0, Colors.gradientHeader1]}
        />
        <TabBarBottom {...this.props} />
      </View>
    );
  }
}

export default SecondaryTabBarComponent;
