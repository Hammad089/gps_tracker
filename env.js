import {TestIds} from 'react-native-google-mobile-ads';
import {TestIds as NTest} from 'react-native-admob-native-ads';
export const Config = {
  AppID: __DEV__
    ? 'ca-app-pub-3940256099942544~3347511713'
    : '',
  BannerHome: __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-6221331930412802/8475994385',
  SplashInter: __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-6221331930412802/8216139938',
  InterHome: __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-6221331930412802/6684416479',
  NativeLanguage: __DEV__ ? NTest.Image:'ca-app-pub-6221331930412802/2963813255',
  NativeIntro: __DEV__ ? NTest.Image : 'ca-app-pub-6221331930412802/4058253137',
  AppOpenResume: __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-6221331930412802/8911108655',
};

export default Config;
