import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

import { Colors, Fonts, Metrics, Styles } from '@themes';
import StringHelper from '@helpers/StringHelper';

const styles = {
  container: {
    width: '100%',
    aspectRatio: 2.6,
    borderRadius: 3,
    justifyContent: 'center',
  },
  cover: {
    borderRadius: 3,
    opacity: 0.1,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.family.satisfy.regular,
    fontSize: Fonts.size.h3,
    textAlign: 'center',
    backgroundColor: Colors.transparent,
  },
  description: {
    color: Colors.text,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.small,
    textAlign: 'center',
    backgroundColor: Colors.transparent,
  },
};

class VideoCategoryCard extends Component {
  render() {
    const { data, index } = this.props;
    const name = StringHelper.getCategoryTitle(data.name);
    const total = data.metadata.connections.videos.total;
    const duration = moment.duration(data.duration, 'seconds').format(`m [${I18n.t('minutes')}]`);
    const colors = [Colors.videoCardCover0, Colors.videoCardCover1, Colors.videoCardCover2];
    const colorIndex = (index % 3);
    const video = data.video;
    return (
      <TouchableOpacity
        onPress={() => { this.props.onPress(data); }}
        style={[styles.container, { backgroundColor: colors[colorIndex] }, StyleSheet.flatten(this.props.style)]}
        activeOpacity={Metrics.touchableOpacity}>
        { video.pictures && video.pictures.sizes && video.pictures.sizes.length > 3 ? <Image source={{ uri: video.pictures.sizes[3].link }} style={[Styles.fill, styles.cover]} resizeMode={'cover'} /> : null }
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{total} {I18n.t('videos')} | {duration}</Text>
      </TouchableOpacity>
    );
  }
}

VideoCategoryCard.defaultProps = {
  onPress: () => {},
  style: {},
};


export default VideoCategoryCard;
