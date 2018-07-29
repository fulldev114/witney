import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';

import { Colors, Fonts, Images, Metrics, Styles } from '@themes';
import Button from '@components/Button';
import ValidationHelper from '@helpers/ValidationHelper';
import StringHelper from '@helpers/StringHelper';
import CONFIG from '@src/config';
import { setGlobalUser } from '@actions/global';

const styles = {
  // Logo
  formControlHeading: {
    flexDirection: 'row',
    marginTop: Metrics.statusBarHeight + Metrics.paddingDefault,
    justifyContent: 'center',
    marginBottom: Metrics.paddingDefault * 4,
  },

  // Submit
  formControlSubmit: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault,
  },

  // Forgot Password
  formControlForgotPassword: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Metrics.paddingDefault,
  },

  // Back
  formGroupBottom: {
    position: 'absolute',
    flexDirection: 'column',
    left: Metrics.paddingDefault * 5,
    right: Metrics.paddingDefault * 5,
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
};

class LoginScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submitting: false,
    };
    this.app = CONFIG.VARIABLES.app;
  }

  async handleSubmit() {
    if (this.state.submitting) {
      return;
    }
    if (!ValidationHelper.validateRequired(this.state.email)) {
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        StringHelper.replaceAll(I18n.t('message_attribute_is_required'), { ':attribute': I18n.t('email') }),
      );
      this.emailRef.focus();
      return;
    }
    if (!ValidationHelper.validateEmail(this.state.email)) {
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        StringHelper.replaceAll(I18n.t('message_attribute_is_not_correct'), { ':attribute': I18n.t('email') }),
      );
      this.emailRef.focus();
      return;
    }

    try {
      this.setState({
        submitting: true,
      });
      await firebase.auth().sendPasswordResetEmail(this.state.email);
      this.app.alertRef.alertWithType(
        'success',
        I18n.t('success'),
        I18n.t('message_an_email_has_been_sent_to_your_inbox'),
      );
    } catch (error) {
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        error.message,
      );
    }
    this.setState({
      submitting: false,
    });
  }

  handleBack() {
    this.props.navigation.goBack();
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
        <Image style={Styles.fill} source={Images.backLogin.source} resizeMode={'cover'} />
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0.8, y: 0.15 }}
          end={{ x: 1, y: 1 }}
          colors={[Colors.gradient2, Colors.gradient3]}
        />
        <View style={[Styles.formContainer, Styles.container]}>
          <View style={[styles.formControlHeading]}>
            <Text style={[Styles.headingText]}>{I18n.t('forgot_password')}</Text>
          </View>
          <Text style={[Styles.formLabel, Styles.label]}>{I18n.t('email')}</Text>
          <View style={[Styles.formControl]}>
            <TextInput
              ref={(ref) => { this.emailRef = ref; }}
              style={[Styles.textInput, Styles.container]}
              keyboardType={'email-address'}
              placeholder={I18n.t('your_email')}
              placeholderTextColor={Colors.placeholderText}
              underlineColorAndroid={Colors.transparent}
              onChangeText={(email) => { this.setState({ email }); }}
              value={this.state.email}
              returnKeyType={'next'}
              onSubmitEditing={this.handleSubmit.bind(this)}
            />
          </View>
          <View style={[styles.formControlSubmit]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]}
              text={I18n.t('submit')}
              textStyle={[Styles.buttonText, Styles.buttonTextOutlined]}
              onPress={this.handleSubmit.bind(this)}
              disabled={this.state.submitting}
              submitting={this.state.submitting}
              submittingProps={Styles.buttonSubmitting}
            />
          </View>
          <View style={styles.formGroupBottom}>
            <View style={[styles.formControlBack]}>
              <Button
                buttonStyle={[Styles.button, Styles.buttonCircle]}
                iconStyle={[Styles.buttonText, styles.buttonIconCircle]}
                icon={'angle-left'}
                onPress={this.handleBack.bind(this)}
                disabled={this.state.submitting}
              />
            </View>
            <Text style={[Styles.note, Styles.textCenter]}>
              {I18n.t('accept_terms_privacy_note')}{' '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('privacy_policy'), 'http://witneyxo.com/privacy')}>
                {I18n.t('privacy_policy')}
              </Text>{', '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('terms_of_service'), 'http://witneyxo.com/terms')}>
                {I18n.t('terms_of_service')}
              </Text>{', '}
              <Text
                style={Styles.noteLink}
                onPress={this.handleDescription.bind(this, I18n.t('billing_terms'), 'http://witneyxo.com/billing-terms')}>
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
  global: state.global,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setGlobalUser: initialize => dispatch(setGlobalUser(initialize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
