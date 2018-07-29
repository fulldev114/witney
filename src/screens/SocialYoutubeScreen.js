import React, { Component } from 'react';
import { FlatList, View } from 'react-native';

import { Metrics, Styles } from '@themes';
import CommonWidget from '@components/CommonWidget';
import VideoCategoryNavigationHeader from '@components/VideoCategoryNavigationHeader';
import YoutubeCard from '@components/YoutubeCard';
import YoutubeApi from '@apis/youtube';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
};

class SocialYoutubeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: props => <VideoCategoryNavigationHeader {...props} data={navigation.state.params.data} />,
  });

  constructor(props) {
    super(props);
    this.state = {
      videos: {
        list: [],
        info: null,
      },
      loading: false,
    };
    this.unmounted = false;
    this.videosURI = '/search';
  }

  componentDidMount() {
    this.handleEndReached();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async handleEndReached() {
    const { videos } = this.state;
    if (this.state.loading || !YoutubeApi.hasNextList(videos.info)) {
      return;
    }
    this.setState({ loading: true });
    const nextVideos = await YoutubeApi.getList(this.videosURI, videos.info, YoutubeApi.getNextVideosParams, YoutubeApi.getVideosInfo);
    const newVideos = YoutubeApi.mergeList(this.state.videos, nextVideos);
    this.setState({
      videos: newVideos,
      loading: false,
    });
  }

  renderItem({ item, index }) {
    return (
      <YoutubeCard
        data={item}
        index={index}
        style={{ marginTop: index === 0 ? Metrics.paddingDefault * 2 : 0 }}
      />
    );
  }

  render() {
    const { loading, videos } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (!loading || (videos && videos.list && videos.list.length > 0)) ? (
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
            </View>
          ) : (
            CommonWidget.renderActivityIndicator()
          )
        }
      </View>
    );
  }
}

export default SocialYoutubeScreen;
