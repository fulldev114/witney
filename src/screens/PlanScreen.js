import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';

import { Colors, Fonts, Images, Metrics, Styles } from '@themes';
import Button from '@components/Button';
import BillingApi from '@apis/billing';
import LocalApi from '@apis/local';
import CONFIG from '@src/config';
import { setGlobalUser } from '@actions/global';

const { INAPP_BILLING: INAPP_BILLING_CONFIG } = CONFIG;

const styles = {
  // Logo
  formControlHeading: {
    flexDirection: 'row',
    marginTop: Metrics.statusBarHeight,
    justifyContent: 'center',
    marginBottom: Metrics.paddingDefault * 4,
  },

  formControlSubHeading: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Metrics.paddingDefault * 2,
    paddingHorizontal: Metrics.paddingDefault * 3,
  },

  // Signup
  formControlSignup: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault,
  },

  // Back
  formGroupBottom: {
    position: 'absolute',
    flexDirection: 'column',
    left: Metrics.paddingDefault * 3,
    right: Metrics.paddingDefault * 3,
    bottom: Metrics.paddingDefault * 2,
  },

  formControlBack: {
    flexDirection: 'row',
    marginBottom: Metrics.paddingDefault * 2.5,
    justifyContent: 'center',
  },
  buttonIconCircle: {
    fontSize: Fonts.size.default * 2,
    position: 'absolute',
    left: (Metrics.formElementHeightDefault * 0.5) - (Fonts.size.default * 0.5),
  },
  buttonTextStrong: {
    fontFamily: Fonts.family.rubik.bold,
  },
  buttonTextNormal: {
    fontFamily: Fonts.family.rubik.regular,
  },

  subHeadingText: {
    fontFamily: Fonts.family.rubik.bold,
    fontSize: Fonts.size.h4,
    color: Colors.text,
  },
};

class PlanScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.app = CONFIG.VARIABLES.app;
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  async handlePlanMonthly() {
    BillingApi.subscribe(
      INAPP_BILLING_CONFIG.PLAN_MONTHLY,
      () => {
        this.gotoMain();
      },
      () => {},
      (e) => {
        console.log(e);
      },
    );
  }

  async handlePlan3Months() {
    BillingApi.subscribe(
      INAPP_BILLING_CONFIG.PLAN_3MONTHS,
      () => {
        this.gotoMain();
      },
      () => {},
      (e) => {
        console.log(e);
      },
    );
  }

  gotoMain() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'main' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  handleBack() {
    LocalApi.removeAuth();
    this.props.setGlobalUser(null);
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'intro' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  handleDescription(title, uri) {
    this.props.navigation.navigate('description', {
      title,
      uri,
    });
  }

  render() {
    return (
      <View style={[Styles.container, Styles.backgroundTransparent]}>
        <Image style={Styles.fill} source={Images.backIntro.source} resizeMode={'cover'} />
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0.1, y: 0.5 }}
          end={{ x: 0, y: 1 }}
          colors={[Colors.gradient2, Colors.gradient3]}
        />
        <View style={[styles.formControlHeading]}>
          <Text style={[Styles.headingText]}>{I18n.t('get_started')}</Text>
        </View>
        <View style={[styles.formControlSubHeading]}>
          <Text style={[styles.subHeadingText, Styles.textCenter]}>To get started choose a plan below.</Text>
        </View>
        <View style={[Styles.formContainer, Styles.container]}>
          <View style={[Styles.formControl]}>
            <TouchableOpacity style={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]} onPress={this.handlePlanMonthly.bind(this)}>
              <Text style={[Styles.buttonText, Styles.buttonTextOutlined]}>
                <Text style={styles.buttonTextStrong}>$19.99</Text>
                <Text style={styles.buttonTextNormal}>/ 1 mo (1 Week Free Trial)</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[Styles.formControl]}>
            <TouchableOpacity style={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]} onPress={this.handlePlan3Months.bind(this)}>
              <Text style={[Styles.buttonText, Styles.buttonTextOutlined]}>
                <Text style={styles.buttonTextStrong}>$54.99</Text>
                <Text style={styles.buttonTextNormal}>/3 mos (1 Week Free Trial)</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[Styles.note, Styles.textCenter]}>
            WitneyXO subscriptions renew within 24-hours before the subscription period ends, you will be charged through your iTunes account. Manage your subscription in Account Settings.
          </Text>
          <View style={styles.formGroupBottom}>
            <View style={[styles.formControlBack]}>
              <Button
                buttonStyle={[Styles.button, Styles.buttonCircle]}
                iconStyle={[Styles.buttonText, styles.buttonIconCircle]}
                icon={'angle-left'}
                onPress={this.handleBack.bind(this)}
              />
            </View>
            <Text style={[Styles.note, Styles.textCenter]}>
              {I18n.t('accept_terms_privacy_note')}{' '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('privacy_policy'), CONFIG.SETTINGS.URIS.PRIVACY)}>
                {I18n.t('privacy_policy')}
              </Text>{', '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('terms_of_service'), CONFIG.SETTINGS.URIS.TERMS)}>
                {I18n.t('terms_of_service')}
              </Text>{', '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('billing_terms'), CONFIG.SETTINGS.URIS.BILLING)}>
                {I18n.t('billing_terms')}
              </Text>{'.'}
            </Text>
          </View>
        </View>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanScreen);
