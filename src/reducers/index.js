import { combineReducers } from 'redux-immutable';
import global from './global';
import video from './video';

const applicationReducers = {
  global,
  video,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
