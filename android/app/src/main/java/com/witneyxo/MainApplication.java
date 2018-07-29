package com.witneyxo;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import com.facebook.react.ReactApplication;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.idehub.Billing.InAppBillingBridgePackage;
import cl.json.RNSharePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.wog.videoplayer.VideoPlayerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeYouTube(),
            new InAppBillingBridgePackage(),
            new RNSharePackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseMessagingPackage(),
            new FBSDKPackage(mCallbackManager),
            new LinearGradientPackage(),
            new RNI18nPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new VideoPlayerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }
}
