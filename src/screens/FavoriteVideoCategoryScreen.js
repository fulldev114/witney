import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import VideoPlayer from 'react-native-native-video-player';
// import Share from 'react-native-share';
import I18n from 'react-native-i18n';
import ActionSheet from 'react-native-actionsheet';
import firebase from 'react-native-firebase';

import { Metrics, Styles } from '@themes';
import CommonWidget from '@components/CommonWidget';
import NavigationButton from '@components/NavigationButton';
import VideoCategoryNavigationHeader from '@components/VideoCategoryNavigationHeader';
import VideoCard from '@components/VideoCard';
import VimeoApi from '@apis/vimeo';
import CONFIG from '@src/config';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
};

const categorySheetOptions = [I18n.t('remove_from_favorites'), I18n.t('cancel')];
let self = null;

class VideoCategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: props => <VideoCategoryNavigationHeader {...props} data={navigation.state.params.data.val()} />,
    headerRight: <NavigationButton icon={'ellipsis-h'} onPress={() => { self.handleShowCategoryShareSheet(); }} />,
  });

  constructor(props) {
    super(props);
    this.state = {
      videos: {
        list: [],
        info: null,
      },
      loading: false,
      shareData: null,
      shareCategory: null,
    };
    this.unmounted = false;
    const data = this.props.navigation.state.params.data.val();
    this.videosURI = `/me${data.metadata.connections.videos.uri}`;
    this.app = CONFIG.VARIABLES.app;
    self = this;
  }

  componentDidMount() {
    this.handleEndReached();
    const { user } = this.props.global;
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
    this.setState({
      videos: newVideos,
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

  handleShareSheetCategory(index) {
    const { data } = this.props.navigation.state.params;
    switch (index) {
      case 0:
        this.handleRemoveCategoryFromFavorites(data);
        break;
      default:
        break;
    }
  }

  handleRemoveCategoryFromFavorites(data) {
    this.firebaseFavoriteCategoriesRef.child(data.key).remove();
    this.props.navigation.goBack();
  }

  renderItem({ item, index }) {
    return (
      <VideoCard
        data={item}
        index={index}
        onVideoPlay={this.handleVideoPlay.bind(this)}
        style={[{ marginTop: index === 0 ? Metrics.paddingDefault * 2 : 0 }]}
      />
    );
  }

  render() {
    const { loading, videos } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (videos && videos.list && videos.list.length > 0) ? (
            <View>
              <FlatList
                data={videos.list}
                keyExtractor={(item, index) => index}
                renderItem={this.renderItem.bind(this)}
                onEndReached={this.handleEndReached.bind(this)}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                style={styles.container}
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
