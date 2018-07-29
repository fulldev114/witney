import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import VideoPlayer from 'react-native-native-video-player';

import CONFIG from '@src/config';
import LocalApi from '@apis/local';
import VimeoApi from '@apis/vimeo';
import { Colors, Fonts, Images, Metrics, Styles } from '@themes';
import Button from '@components/Button';
import BillingApi from '@apis/billing';
import { setGlobalUser, setGlobalIntroVideo } from '@actions/global';

const styles = {
  // Logo
  formControlLogo: {
    flexDirection: 'row',
    marginTop: Metrics.statusBarHeight + (Metrics.paddingDefault * 2),
  },

  // Play
  formControlPlay: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault * 5.5,
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: Colors.transparent,
  },
  playIcon: {
    color: Colors.text,
    fontSize: Fonts.size.h1 * 1.5,
  },

  // Signup With Facebook
  formControlFacebook: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault * 4,
  },

  // Signup With Email
  formControlEmail: {
    flexDirection: 'row',
    marginTop: Metrics.paddingDefault,
  },

  // Bottom
  formGroupBottom: {
    position: 'absolute',
    flexDirection: 'column',
    left: Metrics.paddingDefault * 5,
    right: Metrics.paddingDefault * 5,
    bottom: Metrics.paddingDefault * 2,
  },

  // Login Button
  formControlLogin: {
    flexDirection: 'row',
    marginBottom: Metrics.paddingDefault * 2.5,
    justifyContent: 'center',
  },
};

class IntroScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  async componentDidMount() {
    setTimeout(() => { SplashScreen.hide(); }, 500);
    BillingApi.loadProducts(async (error, products) => {
      console.log(products);
      if (products.length === 0) {
        CONFIG.VARIABLES.app.alertRef.alertWithType(
          'error',
          I18n.t('error'),
          error.message,
        );
      }
      const auth = await LocalApi.getAuth();
      if (auth) {
        this.props.navigation.navigate('login');
      }
    });
  }

  async handleVideoPlay() {
    const { global } = this.props;
    let introVideo = null;
    if (!global.introVideo) {
      const portfolios = await VimeoApi.getList('/me/portfolios', null, VimeoApi.getNextParams, VimeoApi.getInfo);
      if (portfolios && portfolios.list && portfolios.list.length > 0) {
        const videos = await VimeoApi.getList(`${portfolios.list[0].uri}/videos`, null, VimeoApi.getNextParams, VimeoApi.getInfo);
        if (videos && videos.list && videos.list.length > 0) {
          introVideo = videos.list[0];
          this.props.setGlobalIntroVideo(introVideo);
        }
      }
    } else {
      introVideo = global.introVideo;
    }

    if (introVideo) {
      const { files } = introVideo;
      if (files && files.length >= 2) {
        VideoPlayer.showVideoPlayer(files[1].link);
      }
    }
  }

  handleLogin() {
    this.props.navigation.navigate('login');
  }

  handleSignupWithEmail() {
    this.props.navigation.navigate('register');
  }

  async handleSignupWithFacebook() {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile']);
      if (result.isCancelled) {
        return;
      }
      this.setState({
        submitting: true,
      });
      const currentAccessToken = await AccessToken.getCurrentAccessToken();
      const credential = await firebase.auth.FacebookAuthProvider.credential(currentAccessToken.accessToken);
      const user = await firebase.auth().signInWithCredential(credential);
      this.setState({
        submitting: false,
      });
      this.login(user, LocalApi.credentialAuth(credential));
    } catch (error) {
      console.log(error);
      CONFIG.VARIABLES.app.alertRef.alertWithType(
        'error',
        I18n.t('error'),
        error.message,
      );
      this.setState({
        submitting: false,
      });
    }
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
        <Image style={Styles.fill} source={Images.backIntro.source} resizeMode={'cover'} />
        <LinearGradient
          style={Styles.fill}
          start={{ x: 0.28, y: 0.05 }}
          end={{ x: 0, y: 1 }}
          colors={[Colors.gradient1, Colors.gradient0]}
        />
        <View style={[Styles.formContainer, Styles.container]}>
          <View style={[styles.formControlLogo]}>
            <Image style={[Styles.logo, Styles.container]} source={Images.logo.source} resizeMode={'cover'} />
          </View>
          <View style={[styles.formControlPlay]}>
            <Button
              buttonStyle={styles.playButton}
              iconStyle={styles.playIcon}
              icon={'play-circle-o'}
              onPress={this.handleVideoPlay.bind(this)}
            />
          </View>
          <View style={[styles.formControlFacebook]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonFacebook, Styles.buttonRound, Styles.container]}
              icon={'facebook'}
              iconStyle={[Styles.buttonIcon, Styles.buttonTextFacebook]}
              text={I18n.t('signup_with_facebook')}
              textStyle={[Styles.buttonText, Styles.buttonTextFacebook]}
              onPress={this.handleSignupWithFacebook.bind(this)}
              submitting={this.state.submitting}
              submittingProps={Styles.buttonSubmitting}
            />
          </View>
          <View style={[styles.formControlEmail]}>
            <Button
              buttonStyle={[Styles.button, Styles.buttonOutlined, Styles.buttonRound, Styles.container]}
              text={I18n.t('signup_with_email')}
              textStyle={[Styles.buttonText, Styles.buttonTextOutlined]}
              onPress={this.handleSignupWithEmail.bind(this)}
              disabled={this.state.submitting}
            />
          </View>
          <View style={styles.formGroupBottom}>
            <View style={[styles.formControlLogin]}>
              <Button
                buttonStyle={[Styles.button]}
                text={I18n.t('login')}
                textStyle={[Styles.buttonText]}
                onPress={this.handleLogin.bind(this)}
                disabled={this.state.submitting}
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
  setGlobalUser: user => dispatch(setGlobalUser(user)),
  setGlobalIntroVideo: video => dispatch(setGlobalIntroVideo(video)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
