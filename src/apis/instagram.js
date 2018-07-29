import CONFIG from '@src/config';
import RestApi from './rest';

const { INSTAGRAM: INSTAGRAM_CONFIG } = CONFIG.API_ENDPOINT;

const InstagramApi = {
  hasNextList: info => (
    (!info.ended)
  ),

  getRequestURL: path => (
    `${INSTAGRAM_CONFIG.URL}${path}`
  ),

  getMediaList: async (prevInfo: Object, nextParamsCallback: Function) => {
    try {
      const url = InstagramApi.getRequestURL('/users/self/media/recent');
      const params = nextParamsCallback(prevInfo);
      const res = await RestApi.get(url, params);
      const { data: list } = await res.json();
      const ended = !(list && list.length > 0);
      const info = {
        ended,
        max: (ended ? false : InstagramApi.getMediaId(list[0].id)),
        min: (ended ? false : InstagramApi.getMediaId(list[list.length - 1].id)),
      };
      return { list, info };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  getNextMediaParams: (prevInfo: Object) => {
    const params = {
      count: 10,
      access_token: INSTAGRAM_CONFIG.ACCESS_TOKEN,
    };

    if (prevInfo.min) {
      params.max_id = prevInfo.min;
    }
    return params;
  },

  getInitialMediaInfo: () => ({
    min: false,
    max: false,
    ended: false,
  }),

  getMediaId: (mediaId) => {
    const index = mediaId.indexOf('_');
    if (index === -1) {
      return mediaId;
    }
    return mediaId.substring(0, index);
  },

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

export default InstagramApi;
