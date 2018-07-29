import React, { Component } from 'react';
import { FlatList, View } from 'react-native';

import CommonWidget from '@components/CommonWidget';
import InstagramCard from '@components/InstagramCard';
import { Metrics, Styles } from '@themes';
import InstagramApi from '@apis/instagram';

const styles = {
  container: {
    paddingHorizontal: Metrics.paddingDefault,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: Metrics.paddingDefault * 2,
  },
  cardContainer: {
    flex: 1,
    // padding: Metrics.paddingDefault,
  },
};

class SocialInstagramScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      medias: {
        info: InstagramApi.getInitialMediaInfo(),
        list: [],
      },
    };
    this.unmounted = false;
  }

  componentDidMount() {
    this.handleEndReached();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getMediaList(medias) {
    const { list } = medias;
    const ret = [];
    const ni = list.length;
    for (let i = 0; i < ni; i += 2) {
      ret.push([
        list[i], list[i + 1],
      ]);
    }

    if (ni % 2 !== 0) {
      ret.push([
        list[ni - 1],
      ]);
    }
    return ret;
  }

  async handleEndReached() {
    const { medias } = this.state;
    if (this.state.loading || !InstagramApi.hasNextList(medias.info)) {
      return;
    }
    this.setState({ loading: true });
    const nextMedias = await InstagramApi.getMediaList(medias.info, InstagramApi.getNextMediaParams);
    const newMedias = InstagramApi.mergeList(this.state.medias, nextMedias);
    this.setState({
      medias: newMedias,
      list: this.getMediaList(newMedias),
      loading: false,
    });
  }

  renderItem({ item, index }) {
    return (
      <View style={[styles.cardRow, { marginTop: (index === 0 ? Metrics.paddingDefault * 2 : 0) }]}>
        {item.map((_item, _index) => (
          <View style={styles.cardContainer} key={_index}>
            <InstagramCard
              data={_item}
              index={_index}
            />
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { loading, list } = this.state;
    return (
      <View style={[Styles.container, Styles.backgroundDefault]}>
        {
          (!loading || (list && list.length > 0)) ? (
            <FlatList
              data={list}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem.bind(this)}
              onEndReached={this.handleEndReached.bind(this)}
              onEndReachedThreshold={0.5}
              refreshing={loading}
              style={styles.container}
            />
          ) : (
            CommonWidget.renderActivityIndicator()
          )
        }
      </View>
    );
  }
}

export default SocialInstagramScreen;
