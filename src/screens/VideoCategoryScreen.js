import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import VideoPlayer from 'react-native-native-video-player';
import Share from 'react-native-share';
import I18n from 'react-native-i18n';
import ActionSheet from 'react-native-actionsheet';
import firebase from 'react-native-firebase';

import { Metrics, Styles } from '@themes';
import CommonWidget from '@components/CommonWidget';
import NavigationButton from '@components/NavigationButton';
import VideoCategoryNavigationHeader from '@components/VideoCategoryNavigationHeader';
import VideoCard from '@components/VideoCard';
import VimeoApi from '@apis/vimeo';
import StringHelper from '@helpers/StringHelper';
import CONFIG from '@src/config';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
};

const sheetOptions = [I18n.t('add_to_favorites'), I18n.t('cancel')];
const categorySheetOptions = [I18n.t('add_to_favorites'), I18n.t('cancel')];
let self = null;

class VideoCategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: props => <VideoCategoryNavigationHeader {...props} data={navigation.state.params.data} />,
    headerRight: <NavigationButton icon={'ellipsis-h'} onPress={() => { self.handleShowCategoryShareSheet(); }} />,
  });

  constructor(props) {
    super(props);
    this.state = {
      videos: {
        list: [],
        info: null,
      },
      list: [],
      loading: false,
      shareData: null,
      shareCategory: null,
    };
    this.unmounted = false;
    const { data } = this.props.navigation.state.params;
    this.videosURI = `/me${data.metadata.connections.videos.uri}`;
    this.app = CONFIG.VARIABLES.app;
    self = this;
  }

  componentDidMount() {
    this.handleEndReached();
    const { user } = this.props.global;
    this.firebaseFavoriteVideosRef = firebase.database().ref(`${user.uid}/favorite_videos`);
    this.firebaseFavoriteCategoriesRef = firebase.database().ref(`${user.uid}/favorite_categories`);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async handleEndReached() {
    const { videos } = this.state;
    if (this.state.loading || !VimeoApi.hasNextList(videos.info)) {
      return;
    }
    this.setState({ loading: true });
    const nextVideos = await VimeoApi.getList(this.videosURI, videos.info, VimeoApi.getNextAlbumVideosParams, VimeoApi.getAlbumVideosInfo);
    const newVideos = VimeoApi.mergeList(this.state.videos, nextVideos);

    let list = [];
    if (newVideos && newVideos.list && newVideos.list.length > 1) {
      list = newVideos.list.slice(1);
    }
    this.setState({
      videos: newVideos,
      list,
      loading: false,
    });
  }

  handleVideoPlay(data) {
    const { files } = data;
    if (files && files.length >= 2) {
      VideoPlayer.showVideoPlayer(files[1].link);
    }
  }

  handleShowShareSheet(shareData) {
    this.setState({ shareData });
    this.actionSheetRef.show();
  }

  handleShowCategoryShareSheet() {
    this.actionSheetCategoryRef.show();
  }

  handleShareSheet(index) {
    const { shareData } = this.state;
    // const shareOptions = {
    //   title: shareData.name,
    //   url: shareData.link,
    //   message: shareData.description,
    // };

    switch (index) {
      case 0:
        this.handleAddToFavorites(shareData);
        break;
      // case 1:
      //   this.handleShare(shareOptions, 'twitter');
      //   break;
      // case 2:
      //   this.handleShare(shareOptions, 'facebook');
      //   break;
      // case 3:
      //   break;
      default:
        break;
    }
  }

  handleShareSheetCategory(index) {
    const { data } = this.props.navigation.state.params;
    switch (index) {
      case 0:
        this.handleAddCategoryToFavorites(data);
        break;
      default:
        break;
    }
  }

  handleShare(shareOptions, social) {
    setTimeout(() => {
      Share.shareSingle(Object.assign(
        shareOptions,
        { social },
      ));
    }, 300);
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

  handleAddCategoryToFavorites(data) {
    this.firebaseFavoriteCategoriesRef.orderByChild('uri').equalTo(data.uri).once('value', (snapshot) => {
      const snapshotData = snapshot.val();
      if (snapshotData && snapshotData.uri !== data.uri) {
        this.app.alertRef.alertWithType(
          'error',
          I18n.t('error'),
          StringHelper.replaceAll(I18n.t('message_attribute_is_exists_in_group'), { ':attribute': I18n.t('category'), ':group': I18n.t('favorites') }));
      } else {
        this.firebaseFavoriteCategoriesRef.push(data);
        this.app.alertRef.alertWithType(
          'success',
          I18n.t('success'),
          StringHelper.replaceAll(I18n.t('message_attribute_is_added_to_group_successfully'), { ':attribute': I18n.t('category'), ':group': I18n.t('favorites') }));
      }
    });
  }

  renderItem({ item, index }) {
    return (
      <VideoCard
        data={item}
        index={index}
        onVideoPlay={this.handleVideoPlay.bind(this)}
        onShare={this.handleShowShareSheet.bind(this)}
        style={[{ marginTop: index === 0 ? Metrics.paddingDefault * 2 : 0 }]}
      />
    );
  }

  render() {
    const { loading, videos, list } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (!loading || (videos && videos.list && videos.list.length > 0)) ? (
            <View>
              <FlatList
                data={list}
                keyExtractor={(item, index) => index}
                renderItem={this.renderItem.bind(this)}
                onEndReached={this.handleEndReached.bind(this)}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                style={styles.container}
              />
              <ActionSheet
                ref={(ref) => { this.actionSheetRef = ref; }}
                options={sheetOptions}
                cancelButtonIndex={1}
                destructiveButtonIndex={1}
                onPress={this.handleShareSheet.bind(this)}
              />
              <ActionSheet
                ref={(ref) => { this.actionSheetCategoryRef = ref; }}
                options={categorySheetOptions}
                cancelButtonIndex={1}
                destructiveButtonIndex={1}
                onPress={this.handleShareSheetCategory.bind(this)}
              />
            </View>
          ) : (
            CommonWidget.renderActivityIndicator()
          )
        }
      </View>
    );
  }
}


const mapStateToProps = state => ({
  global: state.get('global'),
});

export default connect(mapStateToProps, null)(VideoCategoryScreen);
