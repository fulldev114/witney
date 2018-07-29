import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import CommonWidget from '@components/CommonWidget';
import VideoCategoryCard from '@components/VideoCategoryCard';
import { Metrics, Styles } from '@themes';
import VimeoApi from '@apis/vimeo';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
};

class VideoCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: {
        list: [],
        info: null,
      },
      loading: false,
    };
    this.unmounted = false;
  }

  componentDidMount() {
    this.handleEndReached();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleGotoVideoCategory(data) {
    this.props.navigation.navigate('videoCategory', { data });
  }

  async handleEndReached() {
    const { albums } = this.state;
    if (this.state.loading || !VimeoApi.hasNextList(albums.info)) {
      return;
    }
    this.setState({ loading: true });
    const nextAlbums = await VimeoApi.getAlbumsList(albums.info);
    const newAlbums = VimeoApi.mergeList(this.state.albums, nextAlbums);
    this.setState({
      albums: newAlbums,
      loading: false,
    });
  }

  renderItem({ item, index }) {
    return (
      <VideoCategoryCard
        data={item}
        index={index}
        onPress={this.handleGotoVideoCategory.bind(this)}
        style={[Styles.videoCategoryCard, { marginTop: index === 0 ? Metrics.paddingDefault * 2 : 0 }]}
      />
    );
  }

  render() {
    const { loading, albums } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (!loading || (albums && albums.list && albums.list.length > 0)) ? (
            <FlatList
              data={albums.list}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem.bind(this)}
              onEndReached={this.handleEndReached.bind(this)}
              refreshing={loading}
              style={[Styles.backgroundTransparent, styles.container]}
            />
          ) : (
            CommonWidget.renderActivityIndicator()
          )
        }
      </View>
    );
  }
}

export default VideoCategoriesScreen;
