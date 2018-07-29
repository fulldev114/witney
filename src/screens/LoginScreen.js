import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

import { Colors, Fonts, Images, Metrics, Styles } from '@themes';
import Button from '@components/Button';
import ValidationHelper from '@helpers/ValidationHelper';
import StringHelper from '@helpers/StringHelper';
import LocalApi from '@apis/local';
import BillingApi from '@apis/billing';
import CONFIG from '@src/config';
import { setGlobalUser } from '@actions/global';

const { AUTH_TYPE } = CONFIG.ENUMS;

const styles = {
  // Logo
  formControlHeading: {
    flexDirection: 'row',
    marginTop: Metrics.statusBarHeight + Metrics.paddingDefault,
    justifyContent: 'center',
  },

  // Login With Facebook
  formControlFacebook: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault * 3,
  },

  // OR
  formLabelOr: {
    flexDirection: 'row',
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.family.rubik.medium,
    fontSize: Fonts.size.default,
    marginTop: Metrics.paddingDefault * 3,
    marginBottom: Metrics.paddingDefault * 3,
  },

  // Login
  formControlLogin: {
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
      password: '',
      submitting: false,
      submittingCredential: false,
    };
    this.app = CONFIG.VARIABLES.app;
  }

  async componentDidMount() {
    const auth = await LocalApi.getAuth();
    this.setState({
      auth,
    });
    if (auth) {
      if (auth.authType === AUTH_TYPE.CREDENTIAL) {
        try {
          this.setState({
            submittingCredential: true,
          });
          const user = await firebase.auth().signInWithCredential(auth.credential);
          this.setState({
            submittingCredential: false,
          });
          this.login(user, auth);
        } catch (error) {
          console.log(error);
          this.app.alertRef.alertWithType(
            'error',
            I18n.t('error'),
            error.message,
          );
          this.setState({
            submittingCredential: false,
          });
        }
      } else if (auth.authType === AUTH_TYPE.EMAIL_AND_PASSWORD) {
        try {
          this.setState({
            email: auth.credential.email,
            password: auth.credential.password,
            submitting: true,
          });
          const user = await firebase.auth().signInWithEmailAndPassword(auth.credential.email, auth.credential.password);
          this.setState({
            submitting: false,
          });
          this.login(user, auth);
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
    }
  }

  async handleSigninWithFacebook() {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile']);
      if (result.isCancelled) {
        return;
      }
      this.setState({
        submittingCredential: true,
      });
      const currentAccessToken = await AccessToken.getCurrentAccessToken();
      const credential = await firebase.auth.FacebookAuthProvider.credential(currentAccessToken.accessToken);
      const user = await firebase.auth().signInWithCredential(credential);
      this.setState({
        submittingCredential: false,
      });
      this.login(user, LocalApi.credentialAuth(credential));
    } catch (error) {
      console.log(error);
      this.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        error.message,
      );
      this.setState({
        submittingCredential: false,
      });
    }
  }

  async handleLogin() {
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
      const user = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      this.setState({
        submitting: false,
      });
      this.login(user, LocalApi.emailAndPasswordAuth({ email: this.state.email, password: this.state.password }));
    } catch (error) {
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

  handleForgotPassword() {
    this.props.navigation.navigate('forgotPassword');
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
            <Text style={[Styles.headingText]}>{I18n.t('login')}</Text>
          </View>
          <View style={[styles.formControlFacebook]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonFacebook, Styles.buttonRound, Styles.container]}
              icon={'facebook'}
              iconStyle={[Styles.buttonIcon, Styles.buttonTextFacebook]}
              text={I18n.t('login_with_facebook')}
              textStyle={[Styles.buttonText, Styles.buttonTextFacebook]}
              onPress={this.handleSigninWithFacebook.bind(this)}
              disabled={this.state.submitting || this.state.submittingCredential}
              submitting={this.state.submittingCredential}
              submittingProps={Styles.buttonSubmitting}
            />
          </View>
          <Text style={[styles.formLabelOr]}>{I18n.t('or')}</Text>
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
              onSubmitEditing={this.handleLogin.bind(this)}
            />
          </View>
          <View style={[styles.formControlLogin]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]}
              text={I18n.t('login')}
              textStyle={[Styles.buttonText, Styles.buttonTextOutlined]}
              onPress={this.handleLogin.bind(this)}
              disabled={this.state.submitting || this.state.submittingCredential}
              submitting={this.state.submitting}
              submittingProps={Styles.buttonSubmitting}
            />
          </View>
          <View style={styles.formControlForgotPassword}>
            <TouchableOpacity
              activeOpacity={Metrics.touchableOpacity}
              onPress={this.handleForgotPassword.bind(this)}
              disabled={this.state.submitting || this.state.submittingCredential}
            >
              <Text style={[Styles.note, Styles.textCenter]}>{I18n.t('forgot_your_password')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroupBottom}>
            <View style={[styles.formControlBack]}>
              <Button
                buttonStyle={[Styles.button, Styles.buttonCircle]}
                iconStyle={[Styles.buttonText, styles.buttonIconCircle]}
                icon={'angle-left'}
                onPress={this.handleBack.bind(this)}
                disabled={this.state.submitting || this.state.submittingCredential}
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
  global: state.global,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setGlobalUser: initialize => dispatch(setGlobalUser(initialize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
