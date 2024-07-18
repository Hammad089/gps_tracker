import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import fonts from '../constants/font';
import LottieView from 'lottie-react-native';
import { AuthRoutes } from '../constants/routes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo'; 
import { Config } from '../../env';

const SplashScreen = () => {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(Config.SplashInter);
  const navigation = useNavigation();
  const animationRef = useRef(null);

  const [retryCount, setRetryCount] = useState(0);

  const checkInternetConnectivity = async () => {
    const netInfo = await NetInfo.fetch();
    console.log('INTERNET CHECK',netInfo);
    return netInfo.isConnected;
  };

  const retryLoadAd = async () => {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      load();
    } else {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
    }
  };

  useEffect(() => {
    if (!load && retryCount < 3) {
      retryLoadAd();
      setRetryCount(retryCount + 1);
    }
  }, [load, retryCount]);

  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(200);
    load();
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  }, [navigation, load]);

  useEffect(() => {
    if (isClosed) {
      AsyncStorage.setItem('canShowAppOpenAd', 'true');
      navigation.navigate(AuthRoutes.Language);
    }
  }, [isClosed]);

  useFocusEffect(
    React.useCallback(() => {
      const delayNavigation = async () => {
        if (isLoaded) {
          show();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      };
      delayNavigation();
    }, [isLoaded])
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Image
          source={require('../assets/images/splash.png')}
          style={{ width: wp('55%'), height: hp('20%'), marginTop: 50 }}
        />
        <Text style={styles.GPStext}>
          GPS <Text style={styles.trackerText}>Tracker</Text>
        </Text>
        <View>
          <LottieView
            ref={animationRef}
            style={styles.lottie}
            source={require('../assets/animation/gps_splash_loading.json')}
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', top: 150 }}>
          <Text style={{ textAlign: 'center', color: '#1E1F4B' }}>This may contain ads</Text>
        </View>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  GPStext: {
    color: '#3972FE',
    fontSize: 38,
    fontWeight: '700',
    fontFamily: fonts.Bold,
    lineHeight: 40,
  },
  trackerText: {
    color: '#1E1F4B',
    fontSize: 38,
    fontWeight: '700',
    fontFamily: fonts.Bold,
    lineHeight: 40,
  },
  lottie: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 100,
    width: 100,
    top: 150,
  },
});
