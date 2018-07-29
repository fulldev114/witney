import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SectionList, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';

import NotificationsSettingsListItem from '@components/NotificationsSettingsListItem';
import { Colors, Fonts, Metrics, Styles } from '@themes';
import AppHelper from '@helpers/AppHelper';
import { setGlobalSettings } from '@actions/global';

const styles = {
  section: {
    borderBottomWidth: 1,
    borderColor: Colors.settingsListItemBorder,
    paddingHorizontal: Metrics.paddingDefault,
    paddingTop: Metrics.paddingDefault * 3,
    paddingBottom: Metrics.paddingDefault,
  },
  sectionText: {
    color: Colors.sectionTitleText,
    fontFamily: Fonts.family.rubik.bold,
    fontSize: Fonts.size.semiSmall,
  },
};

const SETTINGS = [
  {
    text: I18n.t('general_notification_settings'),
    data: [
      { text: I18n.t('new_video_alert'), field: 'general__new_video_alert' },
      { text: I18n.t('motivation_reminders'), field: 'general__motivation_reminders' },
    ],
  },
];

class SettingsNotificationsScreen extends Component {
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
    console.log(this.props.global);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async handleNotificationSettingsChange(field, value) {
    const { user, settings } = this.props.global;
    if (value) {
      firebase.messaging().requestPermissions();
    }

    if (settings) {
      settings.notifications[field] = value;
      await AppHelper.updateSettings(user, settings);
      const newSettings = await AppHelper.getSettings(user);
      this.props.setGlobalSettings(newSettings);
    }

    switch (field) {
      case '':
        break;
      default:
        break;
    }
  }

  renderItem({ item, index }) {
    const { settings } = this.props.global;
    const value = (settings && settings.notifications) ? settings.notifications[item.field] : false;
    return (
      <NotificationsSettingsListItem
        index={index}
        text={item.text}
        field={item.field}
        value={value}
        onValueChange={this.handleNotificationSettingsChange.bind(this)}
      />
    );
  }

  renderSectionHeader({ section }) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{section.text}</Text>
      </View>
    );
  }

  render() {
    const { user } = this.props.global;
    return (
      user ? (
        <View style={[Styles.container, Styles.backgroundDefault]}>
          <SectionList
            sections={SETTINGS}
            keyExtractor={(item, index) => index}
            renderItem={this.renderItem.bind(this)}
            renderSectionHeader={this.renderSectionHeader.bind(this)}
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
  setGlobalSettings: initialize => dispatch(setGlobalSettings(initialize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsNotificationsScreen);
