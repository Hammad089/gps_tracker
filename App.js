import remoteConfig from '@react-native-firebase/remote-config';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import SplashScreen from 'react-native-splash-screen';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CustomStatusBar from './src/components/CustomStatusBar';
import { useAppOpenAd } from './src/hooks/appOpenAdhook';
import GdprcallConsent from './src/logic/GdprcallConsent';
import RootStackNavigator from './src/navigation/RootNavigator';
import {AppOpenAd} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setremoteConfig,
  userConsent,
} from './src/store/actions/RemoteConfigAction';
import {
  onMoveToBackground,
  onMoveToForeground,
} from '@quan2nd/react-native-activity-state';
import Config from './env';
import { persistor, store } from './src/store/store';
const THEME_COLOR = '#fff';

const ShowAppOpenAds = () => {
  const { adClosed, loading } = useAppOpenAd();
  const isConsent = useSelector(state => state.remoteConfigReducer.isConsent);

  useEffect(() => {
    if ((adClosed || !loading) ) {
      SplashScreen.hide();
    }
  }, [adClosed, loading]);

  if (!isConsent) return <RootStackNavigator />;
  
  return <RootStackNavigator />;
};

const GdprConsentConfig = () => {
  const { isConsent } = useSelector(state => state.remoteConfigReducer);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isConsent) {
      consentInitializeModules();
    } else {
      GdprConsentInit();
    }
  }, [isConsent]);

  const GdprConsentInit = async () => {
    try {
      let consentInfo = await GdprcallConsent();
      console.log(consentInfo, 'consentInfo');
      if (consentInfo) {
        dispatch(userConsent(true));
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const consentInitializeModules = () => {
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        mobileAds()
          .initialize()
          .then(adapterStatuses => {
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      });
  };

  if (loading) return null;

  return <ShowAppOpenAds />;
};

const RemoteConfigApp = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const AddConfig = useSelector(state => state.remoteConfigReducer.AddConfig);
  const isConsent = useSelector(state => state.remoteConfigReducer.isConsent);
  const adUnitId = AddConfig.AppOpenResume ? Config.AppOpenResume : '';
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
  });

  useEffect(() => {
    const subscriptionFore = onMoveToForeground(async () => {
      if (isConsent) {
        AsyncStorage.getItem('canShowAppOpenAd').then(value => {
          if (value !== null && value !== 'false' && appOpenAd.loaded) {
            appOpenAd.show();
          }
          if (value === 'false') {
            AsyncStorage.setItem('canShowAppOpenAd', 'true');
          }
        });
      }
    });

    const subscriptionBack = onMoveToBackground(() => {
      if (isConsent && !appOpenAd.loaded) appOpenAd.load();
    });

    return () => {
      subscriptionFore.remove();
      subscriptionBack.remove();
    };
  }, [isConsent]);

  useEffect(() => {
    remoteConfigCon();
  }, []);

  const remoteConfigCon = async () => {
    try {
      await remoteConfig().fetchAndActivate();
      const config = remoteConfig().getAll();
      const MyMapConfig = {
        BannerHome: JSON.parse(config.banner_home._value),
        SplashInter: JSON.parse(config.splash_inter._value),
        InterHome: JSON.parse(config.Inter_home._value),
        NativeLanguage: JSON.parse(config.native_language_Ad_language_screen._value),
        NativeIntro: JSON.parse(config.onboarding_Ad._value),
        AppOpenResume: JSON.parse(config.app_open._value),
        LanguageScreen2: JSON.parse(config.language_screen2._value),
      };
      //console.log(MyMapConfig);
      dispatch(setremoteConfig(MyMapConfig));
      //console.log('GDSGDGDGDG',JSON.parse(config.native_language_Ad_language_screen._value));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return null;

  return <GdprConsentConfig />;
};

const App = () => {
  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'auto',
      locationProvider: 'auto',
    });
  }, []);

  

  useEffect(() => {
    myfunction();
  }, []);

  const myfunction = async () => {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 3000,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CustomStatusBar
            backgroundColor={THEME_COLOR}
            barStyle="dark-content"
          />
          <ToastProvider>
            <RemoteConfigApp />
          </ToastProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};


export default App;

const styles = StyleSheet.create({
  bottomSafeArea: {
    flex: 1,
    backgroundColor: THEME_COLOR,
  },
});