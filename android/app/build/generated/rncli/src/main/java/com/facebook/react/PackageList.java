
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// @notifee/react-native
import io.invertase.notifee.NotifeePackage;
// @quan2nd/react-native-activity-state
import com.reactnativeactivitystate.ActivityStatePackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-clipboard/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/checkbox
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-community/slider
import com.reactnativecommunity.slider.ReactSliderPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/remote-config
import io.invertase.firebase.config.ReactNativeFirebaseConfigPackage;
// @shopify/flash-list
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-admob-native-ads
import com.ammarahmed.rnadmob.nativeads.RNAdMobNativePackage;
// react-native-compass-heading
import com.compassheading.CompassHeadingPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-curved-bottom-bar
import com.curvedbottombar.CurvedBottomBarPackage;
// react-native-device-country
import com.reactnativedevicecountry.DeviceCountryPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-geolocation-service
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-google-mobile-ads
import io.invertase.googlemobileads.ReactNativeGoogleMobileAdsPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-maps
import com.rnmaps.maps.MapsPackage;
// react-native-navigation-bar-color
import com.thebylito.navigationbarcolor.NavigationBarColorPackage;
// react-native-network-info
import com.pusherman.networkinfo.RNNetworkInfoPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-system-navigation-bar
import com.reactnativesystemnavigationbar.SystemNavigationBarPackage;
// react-native-tts
import net.no_mad.tts.TextToSpeechPackage;
// react-native-wifi-reborn
import com.reactlibrary.rnwifi.RNWifiPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new VectorIconsPackage(),
      new NotifeePackage(),
      new ActivityStatePackage(),
      new AsyncStoragePackage(),
      new ClipboardPackage(),
      new ReactCheckBoxPackage(),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new ReactSliderPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseConfigPackage(),
      new ReactNativeFlashListPackage(),
      new LottiePackage(),
      new RNAdMobNativePackage(),
      new CompassHeadingPackage(),
      new ReactNativeContacts(),
      new CurvedBottomBarPackage(),
      new DeviceCountryPackage(),
      new RNDeviceInfo(),
      new FastImageViewPackage(),
      new RNFusedLocationPackage(),
      new RNGestureHandlerPackage(),
      new ReactNativeGoogleMobileAdsPackage(),
      new ImagePickerPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new MapsPackage(),
      new NavigationBarColorPackage(),
      new RNNetworkInfoPackage(),
      new RNPermissionsPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new SplashScreenReactPackage(),
      new SvgPackage(),
      new SystemNavigationBarPackage(),
      new TextToSpeechPackage(),
      new RNWifiPackage()
    ));
  }
}
