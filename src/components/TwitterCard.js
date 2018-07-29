import React, { Component } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Html5Entities } from 'html-entities';
import VideoPlayer from 'react-native-native-video-player';
import moment from 'moment';

import { Colors, Fonts, Metrics } from '@themes';

const styles = {
  container: {
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    marginBottom: Metrics.paddingDefault * 2,
  },
  avatar: {
    width: Metrics.iconDefault,
    height: Metrics.iconDefault,
    marginRight: Metrics.paddingDefault,
  },
  avatarImage: {
    width: Metrics.iconDefault,
    height: Metrics.iconDefault,
    borderRadius: Metrics.iconDefault / 2,
  },
  content: {
    flex: 1,
  },
  link: {
    color: Colors.twitter,
  },
  mediaContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  mediaPlay: {
    fontSize: 48,
    color: Colors.text,
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.default,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: Colors.black,
    fontFamily: Fonts.family.rubik.medium,
    fontSize: Fonts.size.default,
  },
  postTime: {
    color: Colors.gray,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.default,
  },
};

class TwitterCard extends Component {
  _getEntitiesByIndices() {
    let newEntities = [];
    const { entities, extended_entities } = this.props.data;
    Object.keys(entities).forEach((entity_key) => {
      const entityItems = entities[entity_key];
      entityItems.forEach((entity) => {
        const newEntity = { entity_key, entity };
        switch (entity_key) {
          case 'media':
            if (extended_entities && extended_entities.media) {
              extended_entities.media.forEach((extended_entity) => {
                if (entity.id_str === extended_entity.id_str) {
                  newEntity.extended_entity = extended_entity;
                  return true;
                }
                return false;
              });
            }
            break;
          default:
            break;
        }
        newEntities.push(newEntity);
      });
    });
    newEntities = newEntities.sort((a, b) => a.entity.indices[0] - b.entity.indices[0]);
    return newEntities;
  }

  _openURL(url) {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        console.log(`Can't handle url: ${url}`);
      }
      return Linking.openURL(url);
    }).catch(err => console.error('An error occurred', err));
  }

  _openVideo(url) {
    VideoPlayer.showVideoPlayer(url);
  }

  _renderHashtag(key, text, entitySet) {
    const url = `https://twitter.com/#${entitySet.entity.text}`;
    return (
      <Text
        key={key}
        style={styles.link}
        onPress={this._openURL.bind(this, url)}>
        {Html5Entities.decode(text)}
      </Text>
    );
  }

  _renderMedia(key, text, entitySet) {
    const sizes = entitySet.entity.sizes &&
      entitySet.entity.sizes.small ? entitySet.entity.sizes.small : null;
    const aspectRatio = sizes ? sizes.w / sizes.h : 1;
    if (entitySet.extended_entity && (entitySet.extended_entity.type === 'video' || entitySet.extended_entity.type === 'animated_gif')) {
      return (
        <TouchableOpacity
          key={key}
          style={[styles.mediaContainer, { aspectRatio }]}
          activeOpacity={0.8}
          onPress={this._openVideo.bind(this, entitySet.extended_entity.video_info.variants[0].url)}>
          <Image
            source={{ uri: entitySet.entity.media_url_https }}
            style={[styles.media]}
            resizeMode={'cover'}
          />
          <Icon name={'play-circle-o'} style={styles.mediaPlay} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        key={key}
        style={[styles.mediaContainer, { aspectRatio }]}
        activeOpacity={0.8}
        onPress={this._openURL.bind(this, entitySet.entity.expanded_url)}>
        <Image
          source={{ uri: entitySet.entity.media_url_https }}
          style={[styles.media]}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  }

  _renderSymbol(key, text) {
    return (
      <Text
        key={key}
        style={styles.link}>
        {Html5Entities.decode(text)}
      </Text>
    );
  }

  _renderUrl(key, text, entitySet) {
    return (
      <Text
        key={key}
        style={styles.link}
        onPress={this._openURL.bind(this, entitySet.entity.expanded_url)}>
        {entitySet.entity.display_url}
      </Text>
    );
  }

  _renderUserMention(key, text, entitySet) {
    const url = `https://twitter.com/${entitySet.entity.screen_name}`;
    return (
      <Text
        key={key}
        style={styles.link}
        onPress={this._openURL.bind(this, url)}>
        {Html5Entities.decode(text)}
      </Text>
    );
  }


  _renderText(key, text) {
    return (
      <Text
        key={key}
        style={styles.text}>
        {Html5Entities.decode(text)}
      </Text>
    );
  }

  render() {
    const uiTexts = [];
    const uiMedia = [];
    const { data } = this.props;
    const text = data.full_text ? data.full_text : data.text;
    const entities = this._getEntitiesByIndices();
    let beforeEntityIndices = [0, 0];
    let key = 1;
    entities.forEach((entitySet) => {
      const entityIndices = entitySet.entity.indices;

      if (beforeEntityIndices[1] !== entityIndices[0]) {
        const beforeText = text.substring(beforeEntityIndices[1], entityIndices[0]);
        uiTexts.push(this._renderText(key, beforeText));
        key++;
      }

      const entityText = text.substring(entityIndices[0], entityIndices[1]);
      switch (entitySet.entity_key) {
        case 'hashtags':
          uiTexts.push(this._renderHashtag(key, entityText, entitySet));
          break;
        case 'media':
          uiMedia.push(this._renderMedia(key, entityText, entitySet));
          break;
        case 'symbols':
          uiTexts.push(this._renderSymbol(key, entityText, entitySet));
          break;
        case 'urls':
          uiTexts.push(this._renderUrl(key, entityText, entitySet));
          break;
        case 'user_mentions':
          uiTexts.push(this._renderUserMention(key, entityText, entitySet));
          break;
        default:
          break;
      }
      beforeEntityIndices = entityIndices;
      key++;
    });

    if (beforeEntityIndices[1] < text.length) {
      uiTexts.push(this._renderText(key, text.substring(beforeEntityIndices[1])));
    }

    const createdAt = new Date(data.created_at);
    const currentAt = new Date();
    const timeDiff = currentAt - createdAt;

    return (
      <View style={[styles.container, StyleSheet.flatten(this.props.style)]}>
        <View style={styles.avatar}>
          <Image source={{ uri: data.user.profile_image_url_https }} style={styles.avatarImage} />
        </View>
        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.username}>{data.user.name}</Text>
            <Text style={styles.postTime}>
              {
                timeDiff <= 3600 * 1000
                  ? (moment(createdAt).startOf('hour').fromNow())
                  : (
                    timeDiff <= 3600 * 1000 * 24 * 7
                      ? moment(createdAt).calendar()
                      : moment(createdAt).format('ll')
                  )
              }
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.text}>
              {uiTexts}
            </Text>
            <View>
              {uiMedia}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

TwitterCard.defaultProps = {
  style: {},
};
export default TwitterCard;
