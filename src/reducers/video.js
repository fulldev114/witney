import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  albums: {
    list: [],
    info: null,
  },
  albumVideos: {
    list: [],
    info: null,
  },
});

const setVideoAlbums = (state, action) => {
  const { albums } = state;
  const { albums: actionAlbums } = action;

  if (albums.info === null || actionAlbums.info.page === 1) {
    return ({
      ...state,
      albums: actionAlbums,
    });
  }

  if (albums.info.page !== (actionAlbums.info.page - 1)) {
    return state;
  }

  return ({
    ...state,
    albums: {
      info: actionAlbums.info,
      list: [...(albums.list), ...(actionAlbums.list)],
    },
  });
};

const setVideoAlbumVideos = (state, action) => {
  const { albumVideos } = state;
  const { albumVideos: actionAlbumVideos } = action;
  if (albumVideos.info === null || albumVideos.info.video_id !== actionAlbumVideos.info.video_id || actionAlbumVideos.info.page === 1) {
    return ({
      ...state,
      albumVideos: actionAlbumVideos,
    });
  }

  if (albumVideos.info.page !== (actionAlbumVideos.info.page - 1)) {
    return state;
  }

  return ({
    ...state,
    albumVideos: {
      info: actionAlbumVideos.info,
      list: [...(albumVideos.list), ...(actionAlbumVideos.list)],
    },
  });
};

const actionHandlers = {
  [Types.SET_VIDEO_ALBUMS]: setVideoAlbums,
  [Types.SET_VIDEO_ALBUM_VIDEOS]: setVideoAlbumVideos,
};

export default createReducer(initialState, actionHandlers);
