import { AsyncStorage } from 'react-native';
import CONFIG from '@src/config';

const { AUTH_TYPE } = CONFIG.ENUMS;
const AUTH_KEY = 'user';

const LocalApi = {
  credentialAuth: (credential: Object) => ({
    authType: AUTH_TYPE.CREDENTIAL,
    credential,
  }),
  emailAndPasswordAuth: (credential: Object) => ({
    authType: AUTH_TYPE.EMAIL_AND_PASSWORD,
    credential,
  }),

  getAuth: async () => {
    try {
      const json = await AsyncStorage.getItem(AUTH_KEY);
      if (json) {
        return JSON.parse(json);
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  removeAuth: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.log(error);
    }
  },
  setAuth: async (auth: Object) => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

export default LocalApi;
