import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from 'react-native-native-video-player';

import StringHelper from '@helpers/StringHelper';
import { Colors, Fonts, Metrics, Styles } from '@themes';

const styles = {
  container: {
    aspectRatio: 1.6,
  },
  cover: {
    opacity: 0.16,
  },
  header: {
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    alignItems: 'center',
  },
  play: {
    marginTop: Metrics.navigationBarHeight * 1.3,
    backgroundColor: Colors.transparent,
  },
  playText: {
    color: Colors.headingText,
    fontSize: Fonts.size.h2,
  },
  title: {
    marginTop: Metrics.paddingDefault * 1.3,
    paddingHorizontal: Metrics.paddingDefault,
    color: Colors.text,
    fontFamily: Fonts.family.satisfy.regular,
    fontSize: Fonts.size.h3,
    backgroundColor: Colors.transparent,
  },
  description: {
    color: Colors.text,
    paddingHorizontal: Metrics.paddingDefault,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.small,
    backgroundColor: Colors.transparent,
  },
};

class NavigationHeader extends Component {
  handleVideoPlay() {
    const { video } = this.props.data;
    if (video) {
      VideoPlayer.showVideoPlayer(video.files[1].link);
    }
  }

  render() {
    const { data } = this.props;
    const video = data.video;
    const name = StringHelper.getCategoryTitle(data.name);
    const total = data.metadata.connections.videos.total;
    const duration = moment.duration(data.duration, 'seconds').format(`m [${I18n.t('minutes')}]`);
    return (
      <View style={[styles.container]}>
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[Colors.gradientHeader0, Colors.gradientHeader1]}
        />
        { video && video.pictures && video.pictures.sizes && video.pictures.sizes.length > 3 ? <Image source={{ uri: video.pictures.sizes[3].link }} style={[Styles.fill, styles.cover]} resizeMode={'cover'} /> : null }
        <View style={[Styles.fill, styles.fill]}>
          <TouchableOpacity
            activeOpacity={Metrics.touchableOpacity}
            onPress={this.handleVideoPlay.bind(this)}
            style={styles.play}
          >
            <Icon name={'play-circle-o'} style={styles.playText} />
          </TouchableOpacity>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{total} {I18n.t('videos')} | {duration}</Text>
        </View>
        <Header {...this.props} style={styles.header} />
      </View>
    );
  }
}

export default NavigationHeader;
