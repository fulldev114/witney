import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { FlatList, View } from 'react-native';
import I18n from 'react-native-i18n';

import NavigationHeader from '@components/NavigationHeader';
import SettingsListItem from '@components/SettingsListItem';
import Profile from '@components/Profile';
import { Colors, Metrics, Styles } from '@themes';
import LocalApi from '@apis/local';
import { setGlobalUser } from '@actions/global';
import CONFIG from '@src/config';

import SettingsNotificationsScreen from './SettingsNotificationsScreen';

const styles = {
  profileContainer: {
    paddingTop: Metrics.paddingDefault * 3,
  },
  listContainer: {
    marginTop: Metrics.paddingDefault * 2,
    borderTopWidth: Metrics.borderWidthDefault,
    borderColor: Colors.settingsListItemBorder,
  },
};

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: {
        list: [],
        info: null,
      },
      loading: false,
      shareData: null,
      shareCategory: null,
    };
    this.unmounted = false;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleNotifications() {
    this.props.navigation.navigate('settingsNotifications');
  }

  handlePrivacyPolicy() {
    this.props.screenProps.rootNavigation.navigate('description', {
      title: I18n.t('privacy_policy'),
      uri: CONFIG.SETTINGS.URIS.PRIVACY,
    });
  }

  handleTermsOfService() {
    this.props.screenProps.rootNavigation.navigate('description', {
      title: I18n.t('terms_of_service'),
      uri: CONFIG.SETTINGS.URIS.TERMS,
    });
  }

  handleBillingTerms() {
    this.props.screenProps.rootNavigation.navigate('description', {
      title: I18n.t('billing_terms'),
      uri: CONFIG.SETTINGS.URIS.BILLING,
    });
  }

  handleLogout() {
    LocalApi.removeAuth();
    this.props.setGlobalUser(null);
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'intro' }),
      ],
    });
    this.props.screenProps.rootNavigation.dispatch(resetAction);
  }

  handleCancelAccount() {
  }

  renderItem({ item, index }) {
    return (
      <SettingsListItem
        text={item.text}
        index={index}
        onPress={item.callback}
      />
    );
  }

  render() {
    const settings = [
      { text: I18n.t('notifications'), callback: this.handleNotifications.bind(this) },
      { text: I18n.t('privacy_policy'), callback: this.handlePrivacyPolicy.bind(this) },
      { text: I18n.t('terms_of_service'), callback: this.handleTermsOfService.bind(this) },
      { text: I18n.t('billing_terms'), callback: this.handleBillingTerms.bind(this) },
      { text: I18n.t('logout'), callback: this.handleLogout.bind(this) },
    ];
    const { user } = this.props.global;

    return (
      user ? (
        <View style={[Styles.container, Styles.backgroundDefault]}>
          <View style={styles.profileContainer}>
            <Profile data={user} />
          </View>
          <FlatList
            data={settings}
            keyExtractor={(item, index) => index}
            renderItem={this.renderItem.bind(this)}
            style={styles.listContainer}
          />
        </View>
      ) : null
    );
  }
}


const mapStateToProps = state => ({
  global: state.get('global'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setGlobalUser: initialize => dispatch(setGlobalUser(initialize)),
});

const SettingsScreenConnect = connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const SettingsNavigator = StackNavigator({
  settings: {
    screen: SettingsScreenConnect,
    navigationOptions: {
      title: I18n.t('profile'),
    },
  },
  settingsNotifications: {
    screen: SettingsNotificationsScreen,
    navigationOptions: {
      title: I18n.t('notifications'),
    },
  },
}, {
  navigationOptions: {
    headerStyle: Styles.navigationHeader,
    headerTitleStyle: Styles.navigationTitle,
    headerTintColor: Colors.navigationText,
    header: props => <NavigationHeader {...props} />,
    headerBackTitle: null,
  },
});

export default SettingsNavigator;
