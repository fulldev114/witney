import Colors from './Colors';
import Fonts from './Fonts';
import Metrics from './Metrics';
import Images from './Images';

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundTransparent: {
    backgroundColor: Colors.transparent,
  },
  backgroundDefault: {
    backgroundColor: Colors.backgroundDefault,
  },
  backgroundSecondary: {
    backgroundColor: Colors.backgroundSecondary,
  },
  formContainer: {
    paddingHorizontal: Metrics.paddingDefault * 4,
  },
  paddingBottomZero: {
    paddingBottom: 0,
  },
  marginBottomZero: {
    marginBottom: 0,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.paddingDefault,
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },

  // Navigation
  navigationHeader: {
    marginTop: Metrics.navigationBarMarginTop,
    backgroundColor: Colors.transparent,
    shadowColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    borderBottomWidth: 0,
    borderBottomColor: Colors.transparent,
    width: '100%',
  },
  navigationCard: {
    backgroundColor: Colors.transparent,
  },
  navigationTitle: {
    position: 'absolute',
    color: Colors.navigationText,
    fontFamily: Fonts.family.satisfy.regular,
    fontWeight: Fonts.weight.ultraLight,
    fontSize: Fonts.size.h5,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  navigationButton: {
    padding: Metrics.paddingDefault,
  },
  navigationButtonIcon: {
    fontSize: Fonts.size.h5,
  },
  navigationButtonText: {
    fontSize: Fonts.size.h5,
    fontFamily: Fonts.family.rubik.regular,
  },

  // Button
  button: {
    alignItems: 'center',
    backgroundColor: Colors.transparent,
    borderWidth: Metrics.buttonBorderWidthDefault,
    borderColor: Colors.transparent,
    height: Metrics.formElementHeightDefault,
    justifyContent: 'center',
    paddingHorizontal: Metrics.formElementHeightDefault * 0.25,
  },
  buttonText: {
    fontFamily: Fonts.family.rubik.medium,
    fontSize: Fonts.size.semiLarge,
    color: Colors.text,
  },
  buttonIcon: {
    fontSize: Fonts.size.semiLarge * 1.125,
    left: Metrics.formElementHeightDefault * 0.5,
    top: (Metrics.formElementHeightDefault - (Fonts.size.semiLarge * 1.125)) / 2,
    // lineHeight: Metrics.formElementHeightDefault,
    position: 'absolute',
  },
  buttonSubmitting: {
    color: Colors.text,
    size: 'small',
    style: {
      right: Metrics.formElementHeightDefault * 0.5,
      top: (Metrics.formElementHeightDefault - (Fonts.size.semiLarge * 1.25)) / 2,
      position: 'absolute',
    },
  },
  buttonRound: {
    borderRadius: Metrics.formElementHeightDefault / 2,
  },
  buttonOutlined: {
    backgroundColor: Colors.buttonBackgroundOutlined,
    borderColor: Colors.buttonBorderOutlined,
  },
  buttonTextOutlined: {
    color: Colors.buttonTextOutlined,
  },
  buttonFacebook: {
    backgroundColor: Colors.buttonBackgroundFacebook,
    borderColor: Colors.buttonBorderFacebook,
  },
  buttonTextFacebook: {
    color: Colors.buttonTextFacebook,
  },

  buttonCircle: {
    backgroundColor: Colors.buttonBackgroundCircle,
    borderColor: Colors.buttonBorderCircle,
    borderRadius: Metrics.formElementHeightDefault / 2,
    borderWidth: Metrics.buttonBorderWidthDefault / 2,
    width: Metrics.formElementHeightDefault,
    paddingHorizontal: 0,
  },
  buttonTextCircle: {
    color: Colors.buttonTextCircle,
  },
  buttonIconCircle: {
    fontSize: Fonts.size.semiLarge * 1.125,
  },

  // CarouselItem
  carouselItem: {
    width: Metrics.screenWidth * 0.6,
  },

  videoCategoryCard: {
    marginBottom: Metrics.paddingDefault * 2,
  },

  // Heading Text
  headingText: {
    color: Colors.headingText,
    fontFamily: Fonts.family.satisfy.regular,
    fontSize: Fonts.size.h2,
    paddingHorizontal: Metrics.paddingDefault,
  },
  label: {
    fontFamily: Fonts.family.rubik.medium,
    fontSize: Fonts.size.default,
    color: Colors.labelText,
  },
  textInput: {
    height: Metrics.formElementHeightDefault,
    fontFamily: Fonts.family.rubik.light,
    fontSize: Fonts.size.h4,
    color: Colors.text,
    borderBottomWidth: Metrics.borderWidthDefault,
    borderColor: Colors.textInputBorder,
  },
  text: {
    fontFamily: Fonts.family.rubik.light,
    fontSize: Fonts.size.h6,
    color: Colors.text,
  },
  textDecorationUnderline: {
    textDecorationLine: 'underline',
  },
  note: {
    color: Colors.text,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.small,
    lineHeight: Fonts.size.small * 1.5,
  },
  noteLink: {
    fontFamily: Fonts.family.rubik.bold,
    textDecorationLine: 'underline',
  },
  formLabel: {
    flexDirection: 'row',
  },
  formControl: {
    flexDirection: 'row',
    marginBottom: Metrics.paddingDefault * 2,
  },
  logo: {
    aspectRatio: Images.logo.size.width / Images.logo.size.height,
  },

  // Tab Bar
  tabBar: {
    backgroundColor: Colors.tabBarBackground,
    borderTopWidth: 0,
    borderColor: Colors.transparent,
    height: Metrics.tabBarHeight,
    shadowColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    justifyContent: 'center',
  },
  tabBarItem: {
    borderWidth: 0,
    shadowColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
  },

  // Secondary Tab Bar
  secondaryTabBar: {
    width: Metrics.screenWidth,
    height: Metrics.secondaryTabBarHeight,
    paddingHorizontal: Metrics.paddingSecondaryTabBarVertical,
    margin: 0,
    padding: 0,
    backgroundColor: Colors.transparent,
    borderTopWidth: 0,
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    justifyContent: 'center',
  },
  secondaryTabBarIndicator: {
    height: 0,
    backgroundColor: Colors.transparent,
  },
  secondaryTabBarItem: {
    borderWidth: 0,
    shadowColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    height: Metrics.secondaryTabBarHeight,
  },
};

export default styles;
