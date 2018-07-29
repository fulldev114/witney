import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import { Colors, Fonts, Metrics, Styles } from '@themes';

const styles = {
  container: {
    width: '100%',
    aspectRatio: 3.8,
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: Metrics.paddingDefault * 2,
    justifyContent: 'space-between',
    backgroundColor: Colors.videoCardBackground,
    flexDirection: 'row',
  },
  thumbnail: {
    aspectRatio: 1,
    height: '100%',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    color: Colors.text,
    fontSize: Fonts.size.h3,
    backgroundColor: Colors.transparent,
  },
  content: {
    flex: 1,
    padding: Metrics.paddingDefault,
  },
  contentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    backgroundColor: Colors.transparent,
    color: Colors.videoCardDuration,
    fontSize: Fonts.size.default,
  },
  share: {
    marginTop: -Metrics.paddingDefault,
    marginRight: -Metrics.paddingDefault,
    padding: Metrics.paddingDefault,
  },
  shareText: {
    backgroundColor: Colors.transparent,
    color: Colors.videoCardShare,
    fontSize: Fonts.size.semiLarge,
  },
  title: {
    color: Colors.videoCardTitle,
    fontFamily: Fonts.family.rubik.medium,
    fontSize: Fonts.size.semiLarge,
    backgroundColor: Colors.transparent,
  },
  description: {
    color: Colors.text,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.semiSmall,
    textAlign: 'center',
    backgroundColor: Colors.transparent,
  },
  progress: {
    marginTop: Metrics.paddingDefault,
    backgroundColor: Colors.videoCardProgressEmpty,
    width: '100%',
    height: 5,
  },
  progressFill: {
    position: 'absolute',
    backgroundColor: Colors.videoCardProgressFill,
    height: '100%',
    left: 0,
    top: 0,
  },
};

class VideoCard extends Component {
  render() {
    const { data } = this.props;
    const duration = moment.duration(data.duration, 'seconds').format('m:s');
    const pictures = data.pictures;
    let percentage = 0;
    if (data.stats && data.stats.plays) {
      percentage = data.stats.plays * 2;
      if (percentage > 100) {
        percentage = 100;
      }
    }
    const progressWidth = `${percentage}%`;
    return (
      <View style={[styles.container, StyleSheet.flatten(this.props.style)]}>
        <TouchableOpacity style={styles.thumbnail} activeOpacity={Metrics.touchableOpacity} onPress={() => { this.props.onVideoPlay(data); }} >
          { (pictures && pictures.sizes && pictures.sizes.length > 3) ? <Image source={{ uri: pictures.sizes[3].link }} style={[Styles.fill]} resizeMode={'cover'} /> : null }
          <Icon name={'play-circle-o'} style={styles.play} />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentTop}>
            <Text style={styles.duration}>{duration}</Text>
            <TouchableOpacity style={styles.share} onPress={() => { this.props.onShare(data); }}>
              <Icon name={'ellipsis-h'} style={styles.shareText} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentMain}>
            <Text style={styles.title}>{data.name}</Text>
            <View style={styles.progress}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

VideoCard.defaultProps = {
  onVideoPlay: () => {},
  onShare: () => {},
  style: {},
};

export default VideoCard;
