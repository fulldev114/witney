import React, { Component } from 'react';
import { Provider } from 'react-redux';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import CONFIG from '@src/config';
import '@i18n';
import App from '@screens';
import configureStore from '@src/configureStore';

const store = configureStore();
momentDurationFormatSetup(moment);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App ref={(ref) => { CONFIG.VARIABLES.app = ref; }} />
      </Provider>
    );
  }
}

export default Root;
