import firebase from 'react-native-firebase';
import deepmerge from 'deepmerge';

import CONFIG from '@src/config';

const AppHelper = {
  updateSettings: async (user: Object, settings: Object) => {
    try {
      const ref = firebase.database().ref(`${user.uid}/settings`);
      await ref.update(settings);
    } catch (error) {
      console.log(error);
    }
  },
  getSettings: async (user: Object) => {
    const ref = firebase.database().ref(`${user.uid}/settings`);
    try {
      const object = await ref.once('value');
      const val = object.val();
      if (val) {
        return deepmerge(CONFIG.SETTINGS.MY_SETTINGS, val);
      }
    } catch (error) {
      console.log(error);
    }
    return deepmerge(CONFIG.SETTINGS.MY_SETTINGS, {});
  },
};

export default AppHelper;
