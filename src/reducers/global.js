import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  user: null,
  introVideo: null,
});

const setGlobalUser = (state, action) => ({
  ...state,
  user: action.user,
});

const setGlobalSettings = (state, action) => ({
  ...state,
  settings: action.settings,
});

const setGlobalIntroVideo = (state, action) => ({
  ...state,
  introVideo: action.video,
});

const actionHandlers = {
  [Types.SET_GLOBAL_USER]: setGlobalUser,
  [Types.SET_GLOBAL_SETTINGS]: setGlobalSettings,
  [Types.SET_GLOBAL_INTRO_VIDEO]: setGlobalIntroVideo,
};

export default createReducer(initialState, actionHandlers);
