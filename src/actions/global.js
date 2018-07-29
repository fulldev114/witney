import Types from './actionTypes';

export const setGlobalUser = user =>
  ({ type: Types.SET_GLOBAL_USER, user });

export const setGlobalSettings = settings =>
  ({ type: Types.SET_GLOBAL_SETTINGS, settings });

export const setGlobalIntroVideo = video =>
  ({ type: Types.SET_GLOBAL_INTRO_VIDEO, video });
