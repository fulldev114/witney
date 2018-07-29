const config = {
  API_ENDPOINT: {
    TWITTER: {
      CONSUMER_KEY: 'gTxhq4VvtUVN9Kxsgihmnt7pB',
      CONSUMER_SECRET: 'LINIzs4RhwsShuXy2fua2TDtuEIbY2pFUk7aUgwsrVsCkJ6u8G',
      ACCESS_TOKEN: '596261273-3Higa35nRSk3FIFv2XHtZtHRQO8jNcu0DUhNUb6t',
      ACCESS_TOKEN_SECRET: 'iNS3t0yqRSCutwrp5KEx7DTO8nnP9nLtdN5xhZVlX9Xcd',
      OWNER: 'WitneyCarson',
      OWNER_ID: '596261273',
    },
    INSTAGRAM: {
      URL: 'https://api.instagram.com/v1',
      CLIENT_ID: 'deaf8c900af04f349ced2ad2532f9c30',
      CLIENT_SECRET: 'b507748433064ad09f0d7c6e2a74d141',
      ACCESS_TOKEN: '6922532.deaf8c9.fb2d612f4edb491fb36af27c9c16b658',
      USER_ID: 'self',
    },
    YOUTUBE: {
      URL: 'https://www.googleapis.com/youtube/v3',
      API_KEY: 'AIzaSyDt8YQrbL_PWtmzBIYtZFLjaSKNkhkUEBk',
      CHANNEL_ID: 'UCgdvqs-dQPXqd51MHmKrWQg',
    },
    VIMEO: {
      URL: 'https://api.vimeo.com',
      ACCESS_TOKEN: '1a4169c5b277db67fc6affa48f8083de',
    },
  },
  INAPP_BILLING: {
    PLAN_MONTHLY: 'com.witneycarson.witneyxo.subscriptions.monthly',
    PLAN_3MONTHS: 'com.witneycarson.witneyxo.subscriptions.3months',
    ITUNE_CONNECT_SHARED_SECRET: 'c1cd924201d94b089a6a838d1e82523f',
  },
  SETTINGS: {
    PER_PAGE: 10,
    RECENTLY_ADDED_VIDEOS_COUNT: 3,
    MY_SETTINGS: {
      notifications: {
        general__new_video_alert: false,
        general__motivation_reminders: false,
      },
    },
    URIS: {
      PRIVACY: 'http://witneyxo.com/privacy',
      TERMS: 'http://witneyxo.com/terms',
      BILLING: 'http://witneyxo.com/billing-terms',
    },
  },
  ENUMS: {
    AUTH_TYPE: {
      CREDENTIAL: 'credential',
      EMAIL_AND_PASSWORD: 'email_and_password',
    },
  },
  VARIABLES: {
    app: null,
  },
};

export default config;
