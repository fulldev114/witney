# Installing Guide
`yarn`

## IOS
### Run for iOS
`react-native run-ios`

## ANDROID
### Run for Android
`react-native run-android` or
`react-native run-android --variant=release`

### Keystore Configuration
 - Keystore file location `$(SRCROOT)/android/app/my-release-key.keystore`
 - Keystore information `$(SRCROOT)/android/gradle.properties`


## Issues
### Facebook
 - goto react-native-fbsdk/android/build.gradle and replace snippet 
    `compile('com.facebook.android:facebook-android-sdk:4.22.1')`