import twitter from 'react-native-twitter';
import bigInt from 'big-integer';

import CONFIG from '@src/config';

const { TWITTER: TWITTER_CONFIG } = CONFIG.API_ENDPOINT;

const twitterToken = {
  consumerKey: TWITTER_CONFIG.CONSUMER_KEY,
  consumerSecret: TWITTER_CONFIG.CONSUMER_SECRET,
  accessToken: TWITTER_CONFIG.ACCESS_TOKEN,
  accessTokenSecret: TWITTER_CONFIG.ACCESS_TOKEN_SECRET,
};

const TwitterApi = {
  hasNextList: info => (
    (!info.ended)
  ),

  getUserTimeline: async (prevInfo: Object) => {
    const { rest } = twitter(twitterToken);
    try {
      const params = TwitterApi.getNextTimelineParams(prevInfo);
      const list = await rest.get('statuses/user_timeline', params);
      const ended = !(list && list.length > 0);
      const info = {
        ended,
        max: (ended ? false : list[0].id_str),
        min: (ended ? false : list[list.length - 1].id_str),
      };
      return { list, info };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  getNextTimelineParams: (prevInfo: Object) => {
    const params = {
      count: 10,
    };

    if (prevInfo.min) {
      params.max_id = bigInt(prevInfo.min).minus(1).toString();
    }
    return params;
  },

  getInitialTimelineInfo: () => ({
    min: false,
    max: false,
    ended: false,
  }),

  mergeList: (origin, next) => {
    if (next === null) {
      return origin;
    }
    if (origin.info === null) {
      return next;
    }

    const originInfo = origin.info;
    const nextInfo = next.info;
    const info = {
      ended: nextInfo.ended,
      max: originInfo.max ? originInfo.max : nextInfo.max,
      min: nextInfo.min ? nextInfo.min : originInfo.min,
    };

    return {
      info,
      list: [...(origin.list), ...(next.list)],
    };
  },
};

export default TwitterApi;
