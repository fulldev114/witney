import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, KeyboardAvoidingView, Text, TextInput, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';

import { Colors, Fonts, Images, Metrics, Styles } from '@themes';
import Button from '@components/Button';
import ValidationHelper from '@helpers/ValidationHelper';
import StringHelper from '@helpers/StringHelper';
import LocalApi from '@apis/local';
import BillingApi from '@apis/billing';
import { setGlobalUser } from '@actions/global';
import CONFIG from '@src/config';


const styles = {
  // Logo
  formControlHeading: {
    flexDirection: 'row',
    marginTop: Metrics.statusBarHeight + Metrics.paddingDefault,
    justifyContent: 'center',
    marginBottom: Metrics.paddingDefault * 4,
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

class RegisterScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      submitting: false,
    };
    this.app = CONFIG.VARIABLES.app;
  }

  componentDidMount() {
  }

  async handleSignup() {
    if (this.state.submitting) {
      return;
    }
    if (!ValidationHelper.validateRequired(this.state.name)) {
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        StringHelper.replaceAll(I18n.t('message_attribute_is_required'), { ':attribute': I18n.t('name') }),
      );
      this.nameRef.focus();
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
    if (!ValidationHelper.validateMinLength(this.state.password, 6)) {
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        StringHelper.replaceAll(I18n.t('message_attribute_length_must_at_least_value'), { ':attribute': I18n.t('password'), ':value': '6' }),
      );
      this.passwordRef.focus();
      return;
    }

    try {
      this.setState({
        submitting: true,
      });
      let user = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
      user.sendEmailVerification();
      await user.updateProfile({
        displayName: this.state.name,
      });
      user = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      this.setState({
        submitting: false,
      });
      this.login(user, LocalApi.emailAndPasswordAuth({ email: this.state.email, password: this.state.password }));
    } catch (error) {
      console.log(error);
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        error.message,
      );
      this.setState({
        submitting: false,
      });
    }
  }

  async login(user: Object, auth: Object) {
    if (user) {
      LocalApi.setAuth(auth);
      this.props.setGlobalUser(user);
      const success = () => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'main' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      };
      const fail = () => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'plan' }),
            // NavigationActions.navigate({ routeName: 'main' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      };
      const error = (e) => {
        console.log(e);
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'plan' }),
            // NavigationActions.navigate({ routeName: 'main' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      };
      BillingApi.isSubscribed(success, fail, error);
    }
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
        <Image style={Styles.fill} source={Images.backIntro.source} resizeMode={'cover'} />
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0, y: 1 }}
          colors={[Colors.gradient2, Colors.gradient3]}
        />
        <KeyboardAvoidingView style={[Styles.formContainer, Styles.container]}>
          <View style={[styles.formControlHeading]}>
            <Text style={[Styles.headingText]}>{I18n.t('register')}</Text>
          </View>
          <Text style={[Styles.formLabel, Styles.label]}>{I18n.t('name')}</Text>
          <View style={[Styles.formControl]}>
            <TextInput
              ref={(ref) => { this.nameRef = ref; }}
              style={[Styles.textInput, Styles.container]}
              placeholder={I18n.t('your_name')}
              placeholderTextColor={Colors.placeholderText}
              underlineColorAndroid={Colors.transparent}
              onChangeText={(name) => { this.setState({ name }); }}
              value={this.state.name}
              returnKeyType={'next'}
              onSubmitEditing={() => { this.emailRef.focus(); }}
            />
          </View>
          <Text style={[Styles.formLabel, Styles.label]}>{I18n.t('email')}</Text>
          <View style={[Styles.formControl]}>
            <TextInput
              ref={(ref) => { this.emailRef = ref; }}
              keyboardType={'email-address'}
              style={[Styles.textInput, Styles.container]}
              placeholder={I18n.t('your_email')}
              placeholderTextColor={Colors.placeholderText}
              underlineColorAndroid={Colors.transparent}
              onChangeText={(email) => { this.setState({ email }); }}
              value={this.state.email}
              returnKeyType={'next'}
              onSubmitEditing={() => { this.passwordRef.focus(); }}
            />
          </View>
          <Text style={[Styles.formLabel, Styles.label]}>{I18n.t('password')}</Text>
          <View style={[Styles.formControl]}>
            <TextInput
              ref={(ref) => { this.passwordRef = ref; }}
              style={[Styles.textInput, Styles.container]}
              secureTextEntry
              placeholder={I18n.t('your_password')}
              placeholderTextColor={Colors.placeholderText}
              underlineColorAndroid={Colors.transparent}
              onChangeText={(password) => { this.setState({ password }); }}
              value={this.state.password}
              returnKeyType={'done'}
              onSubmitEditing={this.handleSignup.bind(this)}
            />
          </View>
          <View style={[styles.formControlSignup]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]}
              text={I18n.t('signup')}
              textStyle={[Styles.buttonText, Styles.buttonTextOutlined]}
              onPress={this.handleSignup.bind(this)}
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
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
