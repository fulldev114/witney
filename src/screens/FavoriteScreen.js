import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';
import ActionSheet from 'react-native-actionsheet';
import VideoPlayer from 'react-native-native-video-player';

import { Colors, Fonts, Metrics, Styles } from '@themes';
import NavigationHeader from '@components/NavigationHeader';
import VideoCard from '@components/VideoCard';
import VideoCategoryCard from '@components/VideoCategoryCard';
import CONFIG from '@src/config';

import FavoriteVideoCategoryScreen from './FavoriteVideoCategoryScreen';

const sheetOptions = [I18n.t('remove_from_favorites'), I18n.t('cancel')];

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
  title: {
    color: Colors.sectionTitleText,
    fontFamily: Fonts.family.rubik.bold,
    fontSize: Fonts.size.semiSmall,
    marginBottom: Metrics.paddingDefault,
    marginTop: Metrics.paddingDefault * 2,
  },
  titleContinueWatching: {
    marginBottom: 0,
  },
};

class FavoriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      videos: [],
      selectedVideo: null,
    };
    this.app = CONFIG.VARIABLES.app;
  }

  componentDidMount() {
    const { user } = this.props.global;
    this.categoriesRef = firebase.database().ref(`${user.uid}/favorite_categories`);
    this.categoriesRef.once('value').then(this.listingCategories.bind(this));
    this.categoriesRef.on('child_removed', this.wrapListingCategories.bind(this));
    this.categoriesRef.on('child_added', this.wrapListingCategories.bind(this));

    this.videosRef = firebase.database().ref(`${user.uid}/favorite_videos`);
    this.videosRef.once('value').then(this.listingVideos.bind(this));
    this.videosRef.on('child_removed', this.wrapListingVideos.bind(this));
    this.videosRef.on('child_added', this.wrapListingVideos.bind(this));
  }

  wrapListingVideos() {
    this.videosRef.once('value').then(this.listingVideos.bind(this));
  }

  listingVideos(snapshot) {
    const videos = [];
    snapshot.forEach((childSnapshot) => {
      videos.push(childSnapshot);
    });
    this.setState({
      videos,
    });
  }

  wrapListingCategories() {
    this.categoriesRef.once('value').then(this.listingCategories.bind(this));
  }
  listingCategories(snapshot) {
    const categories = [];
    snapshot.forEach((childSnapshot) => {
      categories.push(childSnapshot);
    });
    this.setState({
      categories,
    });
  }

  handleVideoPlay(data) {
    const { files } = data;
    if (files && files.length >= 2) {
      VideoPlayer.showVideoPlayer(files[1].link);
    }
  }

  handleGotoVideoCategory(data) {
    this.props.navigation.navigate('favoriteVideoCategory', { data });
  }

  handleShowSheet(selectedVideo) {
    this.setState({ selectedVideo });
    this.actionSheetRef.show();
  }

  handleRemoveVideo(video) {
    if (!video) {
      return;
    }
    this.videosRef.child(video.key).remove();
  }

  handleSheet(index) {
    switch (index) {
      case 0:
        this.handleRemoveVideo(this.state.selectedVideo);
        break;
      default:
        break;
    }
  }

  renderVideoCategoryItem({ item, index }) {
    const value = item.val();
    return (
      <VideoCategoryCard
        data={value}
        index={index}
        onPress={() => { this.handleGotoVideoCategory(item); }}
        style={[Styles.carouselItem, { aspectRatio: 2, marginLeft: index === 0 ? 0 : Metrics.paddingDefault * 2 }]}
      />
    );
  }

  renderVideoItem({ item, index }) {
    const value = item.val();
    return (
      <VideoCard
        data={value}
        index={index}
        onVideoPlay={this.handleVideoPlay.bind(this)}
        onShare={() => { this.handleShowSheet(item); }}
      />
    );
  }

  render() {
    return (
      <ScrollView style={[Styles.container, styles.container, Styles.backgroundDefault]}>
        {this.state.categories && this.state.categories.length ? (
          <View>
            <Text style={styles.title}>{I18n.t('saved_categories')}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.categories}
              keyExtractor={(item, index) => index}
              renderItem={this.renderVideoCategoryItem.bind(this)}
            />
          </View>
        ) : null}
        {this.state.videos && this.state.videos.length ? (
          <View>
            <Text style={[styles.title]}>{I18n.t('saved_videos')}</Text>
            <FlatList
              data={this.state.videos}
              keyExtractor={(item, index) => index}
              renderItem={this.renderVideoItem.bind(this)}
            />
          </View>
        ) : null}
        <ActionSheet
          ref={(ref) => { this.actionSheetRef = ref; }}
          options={sheetOptions}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={this.handleSheet.bind(this)}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  global: state.get('global'),
});

const FavoriteScreenConnect = connect(mapStateToProps, null)(FavoriteScreen);

const FavoriteNavigator = StackNavigator({
  favorite: {
    screen: FavoriteScreenConnect,
    navigationOptions: {
      title: I18n.t('favorites'),
    },
  },
  favoriteVideoCategory: {
    screen: FavoriteVideoCategoryScreen,
  },
}, {
  navigationOptions: {
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
    header: props => <NavigationHeader {...props} />,
    headerBackTitle: null,
  },
});

export default FavoriteNavigator;
