import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Colors, Fonts, Metrics, Styles } from '@themes';
import CONFIG from '@src/config';

const { YOUTUBE: YOUTUBE_CONFIG } = CONFIG.API_ENDPOINT;

const styles = {
  container: {
    width: '100%',
    aspectRatio: 1.78,
    borderRadius: Metrics.borderRadiusDefault,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Metrics.paddingDefault * 2,
  },
  thumbnail: {
    borderRadius: Metrics.borderRadiusDefault,
  },
  play: {
    color: Colors.text,
    backgroundColor: Colors.transparent,
    fontSize: Fonts.size.h2,
  },
};

class YoutubeCard extends Component {
  handleVideoPlay(data) {
    if (Platform.OS === 'android') {
      YouTubeStandaloneAndroid.playVideo({
        apiKey: YOUTUBE_CONFIG.API_KEY,
        videoId: data.id.videoId,
        autoplay: true,
      });
    } else {
      YouTubeStandaloneIOS.playVideo(data.id.videoId);
    }
  }

  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, StyleSheet.flatten(this.props.style)]}
        activeOpacity={Metrics.touchableOpacity}
        onPress={this.handleVideoPlay.bind(this, data)}
      >
        <Image
          source={{ uri: data.snippet.thumbnails.high.url }}
          resizeMode={'cover'}
          style={[Styles.fill, styles.thumbnail]}
        />
        <Icon name={'play-circle-o'} style={styles.play} />
      </TouchableOpacity>
    );
  }
}

YoutubeCard.defaultProps = {
  style: {},
};

export default YoutubeCard;
