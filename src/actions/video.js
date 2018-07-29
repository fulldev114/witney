import Types from './actionTypes';

export const setVideoAlbums = albums =>
  ({ type: Types.SET_VIDEO_ALBUMS, albums });

export const setVideoAlbumVideos = albumVideos =>
  ({ type: Types.SET_VIDEO_ALBUMS, albumVideos });

