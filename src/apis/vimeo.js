import CONFIG from '@src/config';
import RestApi from './rest';

const { VIMEO: VIMEO_CONFIG } = CONFIG.API_ENDPOINT;

const VimeoApi = {

  getRequestHeader: () => ({
    Authorization: `Bearer ${VIMEO_CONFIG.ACCESS_TOKEN}`,
  }),

  getRequestURL: (path: string) => (
    `${VIMEO_CONFIG.URL}${path}`
  ),

  hasNextList: info => (
    (!info || info.paging.next)
  ),

  getList: async (path: string, prevInfo: Object, nextParamsCallback: Function, infoCallback: Function) => {
    try {
      const url = VimeoApi.getRequestURL(path);
      const header = VimeoApi.getRequestHeader();
      const params = nextParamsCallback(prevInfo);
      const res = await RestApi.get(url, params, header);
      const { data: list, total, page, per_page, paging } = await res.json();
      const newInfo = { total, page, per_page, paging };
      const info = infoCallback(prevInfo, newInfo);
      return { list, info };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  getAlbumsList: async (prevInfo: Object) => {
    const data = await VimeoApi.getList('/me/albums', prevInfo, VimeoApi.getNextAlbumsParams, VimeoApi.getAlbumsInfo);

    const callback = async (album: Object) => {
      const videos = await VimeoApi.getList(
        `${album.uri}/videos`,
        {
          sort: 'manual',
          page: 0,
          per_page: 1,
        },
        VimeoApi.getNextAlbumVideosParams,
        VimeoApi.getAlbumVideosInfo,
      );
      if (videos && videos.list && videos.list.length > 0) {
        return videos.list[0];
      }
      return null;
    };

    if (data && data.list) {
      const { list } = data;
      const callbacks = [];
      for (let i = 0, ni = list.length; i < ni; i++) {
        const item = list[i];
        callbacks.push(callback(item));
      }
      const values = await Promise.all(callbacks);
      for (let i = 0, ni = list.length; i < ni; i++) {
        const item = list[i];
        item.video = values[i];
      }
    }
    return data;
  },

  mergeList: (origin, next) => {
    if (next === null) {
      return origin;
    }
    if (origin.info === null) {
      return next;
    }

    if (origin.info.page !== (next.info.page - 1)) {
      return origin;
    }

    return {
      info: next.info,
      list: [...(origin.list), ...(next.list)],
    };
  },

  /** ========== COMMON ========== */
  getNextParams: (info) => {
    if (!info) {
      return {};
    }

    return {
      page: (info.page + 1),
      per_page: info.per_page,
    };
  },

  getInfo: (prevInfo: Object, info: Object) => (
    info
  ),

  /** ========== ALBUMS ========== */
  getNextAlbumsParams: (info) => {
    if (!info) {
      return {
        sort: 'alphabetical',
      };
    }

    return {
      sort: 'alphabetical',
      page: (info.page + 1),
      per_page: info.per_page,
    };
  },

  getAlbumsInfo: (prevInfo: Object, info: Object) => (
    info
  ),

  /** ========== ALBUM VIDEOS ========== */
  getNextAlbumVideosParams: (info) => {
    if (!info) {
      return {
        sort: 'manual',
      };
    }
    return {
      sort: 'manual',
      page: (info.page + 1),
      per_page: info.per_page,
    };
  },

  getAlbumVideosInfo: (prevInfo: Object, info: Object) => (
    info
  ),

  /** ========== VIDEOS ========== */
  getNextVideosParams: (info) => {
    if (!info) {
      return {
        sort: 'plays',
      };
    }
    return {
      page: (info.page + 1),
      per_page: info.per_page,
      sort: 'plays',
    };
  },

  getVideosInfo: (prevInfo: Object, info: Object) => (
    info
  ),
};

export default VimeoApi;
