import CONFIG from '@src/config';
import RestApi from './rest';

const { YOUTUBE: YOUTUBE_CONFIG } = CONFIG.API_ENDPOINT;

const YoutubeApi = {

  getRequestURL: (path: string) => (
    `${YOUTUBE_CONFIG.URL}${path}`
  ),

  hasNextList: info => (
    (!info || info.nextPageToken)
  ),

  getList: async (path: string, prevInfo: Object, nextParamsCallback: Function, infoCallback: Function) => {
    try {
      const url = YoutubeApi.getRequestURL(path);
      const params = nextParamsCallback(prevInfo);
      const res = await RestApi.get(url, params);
      const { items: list, nextPageToken } = await res.json();
      const newInfo = { nextPageToken: (nextPageToken || null) };
      const info = infoCallback(prevInfo, newInfo);
      return { list, info };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  mergeList: (origin, next) => {
    if (next === null) {
      return origin;
    }
    if (origin.info === null) {
      return next;
    }

    return {
      info: next.info,
      list: [...(origin.list), ...(next.list)],
    };
  },

  /** ========== CHANEL VIDEOS ========== */
  getNextVideosParams: (info) => {
    const nextParams = {
      channelId: YOUTUBE_CONFIG.CHANNEL_ID,
      key: YOUTUBE_CONFIG.API_KEY,
      type: 'video',
      part: 'snippet',
    };

    if (info && info.nextPageToken) {
      nextParams.pageToken = info.nextPageToken;
    }

    return nextParams;
  },

  getVideosInfo: (prevInfo: Object, info: Object) => (
    info
  ),
};

export default YoutubeApi;
