import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';

import { Colors, Fonts, Metrics } from '@themes';

const styles = {
  container: {
    alignItems: 'center',
  },
  photoContainer: {
    borderRadius: Metrics.profilePhotoHeight / 2,
    width: Metrics.profilePhotoHeight,
    height: Metrics.profilePhotoHeight,
    backgroundColor: Colors.profilePhotoBackground,
    justifyContent: 'center',
  },
  photo: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: Metrics.profilePhotoHeight / 2,
    width: Metrics.profilePhotoHeight,
    height: Metrics.profilePhotoHeight,
  },
  photoText: {
    backgroundColor: Colors.transparent,
    color: Colors.profilePhotoText,
    fontFamily: Fonts.family.rubik.bold,
    fontSize: Fonts.size.h3,
    textAlign: 'center',
  },
  nameText: {
    color: Colors.profileNameText,
    fontFamily: Fonts.family.satisfy.regular,
    fontSize: Fonts.size.h3,
  },
  text: {
    color: Colors.profileText,
    fontFamily: Fonts.family.rubik.bold,
    fontSize: Fonts.size.semiSmall,
  },
};

class ListItem extends Component {
  render() {
    const { data } = this.props;
    const { photoURL, displayName, email } = data;
    const displayNameAbbr = displayName.substring(0, 1);

    return (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          {photoURL ? (<Image source={{ url: photoURL }} resizeMode={'cover'} style={styles.photo} />) : <Text style={styles.photoText}>{displayNameAbbr}</Text>}
        </View>
        <Text style={styles.nameText}>{displayName}</Text>
        <Text style={styles.text}>{email}</Text>
      </View>
    );
  }
}

export default ListItem;
