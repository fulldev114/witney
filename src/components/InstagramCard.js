import React, { Component } from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from 'react-native-native-video-player';

import { Colors, Fonts, Metrics } from '@themes';

const styles = {
  card: {
    paddingHorizontal: Metrics.paddingDefault,
  },
  cardInner: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: Metrics.borderRadiusDefault,
  },
  cardPlay: {
    position: 'absolute',
    color: Colors.text,
    backgroundColor: Colors.transparent,
    fontSize: Fonts.size.h2,
  },
};

class InstagramCard extends Component {
  handlePress() {
    const { data } = this.props;
    const { type } = data;
    if (type === 'video') {
      VideoPlayer.showVideoPlayer(data.videos.standard_resolution.url);
    } else {
      Linking.openURL(data.link);
    }
  }
  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity style={styles.card} activeOpacity={Metrics.touchableOpacity} onPress={this.handlePress.bind(this)}>
        <View style={styles.cardInner}>
          <Image source={{ uri: data.images.standard_resolution.url }} style={styles.cardThumbnail} resizeMode={'cover'} />
          { data.type === 'video' ? <Icon name={'play-circle-o'} style={styles.cardPlay} /> : null }
        </View>
      </TouchableOpacity>
    );
  }
}

export default InstagramCard;

