import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const metrics = {
  buttonBorderWidthDefault: 2,
  borderWidthDefault: 1,
  borderRadiusDefault: 4,

  formElementHeightDefault: 50,

  iconSmall: 28,
  iconDefault: 40,

  navigationBarHeight: 64,
  navigationBarMarginTop: Platform.OS === 'android' ? 10 : 0,

  paddingDefault: 10,
  paddingSecondaryTabBarVertical: (width - (38 * 4)) / 2,

  screenHeight: height,
  screenWidth: width,
  secondaryTabBarHeight: 39,
  statusBarHeight: 20,

  tabBarHeight: 45,
  tabBarBorderWidth: 38,
  touchableOpacity: 0.7,

  profilePhotoHeight: width / 3,

};

export default metrics;
