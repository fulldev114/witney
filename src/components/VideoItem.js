import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Colors, Fonts, Metrics, Styles } from '@themes';

const styles = {
  container: {
    width: '100%',
    aspectRatio: 1.51,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    color: Colors.text,
    backgroundColor: Colors.transparent,
  },
  playDefault: {
    fontSize: Fonts.size.h2 - 1,
  },
  playSmall: {
    fontSize: Fonts.size.h3 - 3,
  },
};

class VideoItem extends Component {
  render() {
    const { size, data } = this.props;
    const { pictures } = data;
    return (
      <TouchableOpacity style={[styles.container, StyleSheet.flatten(this.props.style)]} activeOpacity={Metrics.touchableOpacity} onPress={() => this.props.onPress(data)}>
        { pictures && pictures.sizes && pictures.sizes.length > 3 ? <Image source={{ uri: pictures.sizes[3].link }} style={[Styles.fill]} resizeMode={'cover'} /> : null }
        <Icon name={'play-circle-o'} style={[styles.play, size === 'default' ? styles.playDefault : styles.playSmall]} />
      </TouchableOpacity>
    );
  }
}

VideoItem.defaultProps = {
  size: 'default',
  onPress: () => {},
  style: {},
};

export default VideoItem;
