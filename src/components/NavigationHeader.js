import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Header } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Styles } from '@themes';

const styles = {
  container: {
  },
  gradient: {
  },
  header: {
    backgroundColor: Colors.transparent,
  },
};

class NavigationHeader extends Component {
  render() {
    const { route } = this.props.scene;
    let styleContainerEx = null;
    let data = null;
    if (route.routeName === 'videoCategory') {
      data = this.props.navigation.state.params;
      styleContainerEx = {
        height: 200,
      };
    }
    return (
      <View style={[styles.container, styleContainerEx]}>
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[Colors.gradientHeader0, Colors.gradientHeader1]}
        />
        { route.routeName === 'videoCategory' && data ? <Image source={{ uri: data.pictures.sizes[3].link }} style={[Styles.fill, styles.cover]} resizeMode={'cover'} /> : null }
        <Header {...this.props} style={styles.header} />
      </View>
    );
  }
}

export default NavigationHeader;
