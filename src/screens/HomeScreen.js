import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, Text, ScrollView, View } from 'react-native';
import I18n from 'react-native-i18n';
import { StackNavigator } from 'react-navigation';
import VideoPlayer from 'react-native-native-video-player';
import firebase from 'react-native-firebase';
import ActionSheet from 'react-native-actionsheet';

import { Colors, Fonts, Metrics, Styles } from '@themes';
import CONFIG from '@src/config';
import VimeoApi from '@apis/vimeo';
import StringHelper from '@helpers/StringHelper';
import AppHelper from '@helpers/AppHelper';
import VideoItem from '@components/VideoItem';
import VideoCard from '@components/VideoCard';
import NavigationHeader from '@components/NavigationHeader';
import CommonWidget from '@components/CommonWidget';
import { setGlobalSettings } from '@actions/global';

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
};

const sheetOptions = [I18n.t('add_to_favorites'), I18n.t('cancel')];

class HomeScreen extends Component {
  static navigationOptions = {
    title: I18n.t('lets_dance'),
    header: props => <NavigationHeader {...props} />,
  }

  constructor(props) {
    super(props);
    this.state = {
      videos: {
        list: [],
        info: null,
      },
      exclusiveVideo: null,
      recentlyAddedVideos: [],
      continueVideos: [],
      loading: false,
      shareData: null,
    };
    this.unmounted = false;
    this.videosURI = '/me/videos';
    this.app = CONFIG.VARIABLES.app;
  }

  async componentDidMount() {
    this.getRecentVideos();
    this.handleEndReached();
    const { user } = this.props.global;
    this.firebaseFavoriteVideosRef = firebase.database().ref(`${user.uid}/favorite_videos`);
    const settings = await AppHelper.getSettings(user);
    this.props.setGlobalSettings(settings);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async getRecentVideos() {
    if (this.unmounted) {
      return;
    }

    const { RECENTLY_ADDED_VIDEOS_COUNT } = CONFIG.SETTINGS;
    const videoInfo = {
      per_page: RECENTLY_ADDED_VIDEOS_COUNT + 1,
      page: 0,
    };
    const videos = await VimeoApi.getList(this.videosURI, videoInfo, VimeoApi.getNextParams, VimeoApi.getInfo);
    const { list } = videos;
    const exclusiveVideo = this.state.exclusiveVideo ? this.state.exclusiveVideo
      : (list.length > 0 ? list[0] : this.state.exclusiveVideo);
    const recentlyAddedVideos = (this.state.recentlyAddedVideos.length === RECENTLY_ADDED_VIDEOS_COUNT)
      ? this.state.recentlyAddedVideos
      : ((list.length < 1) ? this.state.recentlyAddedVideos : list.slice(1));

    this.setState({
      exclusiveVideo,
      recentlyAddedVideos,
    });
  }

  async handleEndReached() {
    if (this.unmounted) {
      return;
    }

    const { videos } = this.state;
    if (this.state.loading || !VimeoApi.hasNextList(videos.info)) {
      return;
    }

    this.setState({ loading: true });
    const nextVideos = await VimeoApi.getList(this.videosURI, videos.info, VimeoApi.getNextVideosParams, VimeoApi.getVideosInfo);
    const newVideos = VimeoApi.mergeList(videos, nextVideos);
    console.log(videos, nextVideos);
    this.setState({
      videos: newVideos,
      loading: false,
    });
  }

  handleAddToFavorites(data) {
    this.firebaseFavoriteVideosRef.orderByChild('uri').equalTo(data.uri).once('value', (snapshot) => {
      const snapshotData = snapshot.val();
      if (snapshotData && snapshotData.uri !== data.uri) {
        this.app.alertRef.alertWithType(
          'error',
          I18n.t('error'),
          StringHelper.replaceAll(I18n.t('message_attribute_is_exists_in_group'), { ':attribute': I18n.t('video'), ':group': I18n.t('favorites') }));
      } else {
        this.firebaseFavoriteVideosRef.push(data);
        this.app.alertRef.alertWithType(
          'success',
          I18n.t('success'),
          StringHelper.replaceAll(I18n.t('message_attribute_is_added_to_group_successfully'), { ':attribute': I18n.t('video'), ':group': I18n.t('favorites') }));
      }
    });
  }

  handleShowShareSheet(shareData) {
    this.setState({ shareData });
    this.actionSheetRef.show();
  }

  handleShareSheet(index) {
    const { shareData } = this.state;

    switch (index) {
      case 0:
        this.handleAddToFavorites(shareData);
        break;
      default:
        break;
    }
  }

  handleVideoPlay(data) {
    const { files } = data;
    if (files && files.length >= 2) {
      VideoPlayer.showVideoPlayer(files[1].link);
    }
  }

  renderRecentlyAddedVideoItem({ item, index }) {
    return (
      <VideoItem
        data={item}
        playSize={'small'}
        style={[Styles.carouselItem, { marginLeft: index === 0 ? 0 : Metrics.paddingDefault * 2 }]}
        onPress={this.handleVideoPlay.bind(this)}
      />
    );
  }

  renderContinueVideoItem({ item, index }) {
    return (
      <VideoCard
        data={item}
        index={index}
        onVideoPlay={this.handleVideoPlay.bind(this)}
        onShare={this.handleShowShareSheet.bind(this)}
      />
    );
  }

  render() {
    return (
      <ScrollView style={[Styles.container, styles.container, Styles.backgroundDefault]} onScroll={this.handleEndReached.bind(this)}>
        {
          (this.state.exclusiveVideo) ? (
            <View>
              <Text style={styles.title}>{I18n.t('exclusive_video')}</Text>
              <VideoItem
                data={this.state.exclusiveVideo}
                onPress={this.handleVideoPlay.bind(this)}
              />
            </View>
          ) : null
        }
        {
          (this.state.recentlyAddedVideos && this.state.recentlyAddedVideos.length > 0)
            ? <Text style={styles.title}>{I18n.t('recently_added_videos')}</Text> : null
        }
        <FlatList
          data={this.state.recentlyAddedVideos}
          keyExtractor={(item, index) => index}
          renderItem={this.renderRecentlyAddedVideoItem.bind(this)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {
          (this.state.videos.list && this.state.videos.list.length > 0)
            ? <Text style={[styles.title]}>{I18n.t('popular_videos')}</Text> : null
        }
        {
          (this.state.loading && (!this.state.videos || this.state.videos.list.length === 0)) ? (
            CommonWidget.renderActivityIndicator()
          ) : (
            <FlatList
              data={this.state.videos.list}
              keyExtractor={(item, index) => index}
              renderItem={this.renderContinueVideoItem.bind(this)}
              refreshing={this.state.loading}
            />
          )
        }
        <ActionSheet
          ref={(ref) => { this.actionSheetRef = ref; }}
          options={sheetOptions}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={this.handleShareSheet.bind(this)}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  global: state.get('global'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setGlobalSettings: initialize => dispatch(setGlobalSettings(initialize)),
});

const HomeScreenConnect = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const HomeNavigator = StackNavigator({
  home: {
    screen: HomeScreenConnect,
    title: I18n.t('home'),
  },
}, {
  navigationOptions: {
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
  },
});

export default HomeNavigator;
