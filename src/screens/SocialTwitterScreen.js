import React, { Component } from 'react';
import { FlatList, View } from 'react-native';

import { Metrics, Styles } from '@themes';
import CommonWidget from '@components/CommonWidget';
import VideoCategoryNavigationHeader from '@components/VideoCategoryNavigationHeader';
import TwitterCard from '@components/TwitterCard';
import TwitterApi from '@apis/twitter';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault * 2,
  },
};

class SocialTwitterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: props => <VideoCategoryNavigationHeader {...props} data={navigation.state.params.data} />,
  });

  constructor(props) {
    super(props);
    this.state = {
      feeds: {
        list: [],
        info: TwitterApi.getInitialTimelineInfo(),
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

  async handleEndReached() {
    const { feeds } = this.state;
    if (this.state.loading || !TwitterApi.hasNextList(feeds.info)) {
      return;
    }
    this.setState({ loading: true });
    const nextFeeds = await TwitterApi.getUserTimeline(feeds.info);
    const newFeeds = TwitterApi.mergeList(this.state.feeds, nextFeeds);
    this.setState({
      feeds: newFeeds,
      loading: false,
    });
  }

  renderItem({ item, index }) {
    const data = item.retweeted_status ? item.retweeted_status : item;
    return (
      <TwitterCard
        data={data}
        index={index}
        style={{ marginTop: index === 0 ? Metrics.paddingDefault * 2 : 0 }}
      />
    );
  }

  render() {
    const { loading, feeds } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (!loading || (feeds && feeds.list && feeds.list.length > 0)) ? (
            <View>
              <FlatList
                data={feeds.list}
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

export default SocialTwitterScreen;
