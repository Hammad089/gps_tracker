import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  BackHandler,
  AppState,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import NativeAdView, {
  AdBadge,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  TaglineView,
} from 'react-native-admob-native-ads';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Config from '../../env';
import fonts from '../constants/font';
import { useSelector } from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useFocusEffect } from '@react-navigation/native';

const SCREEN_WIDTH = wp(100);

const NativeAdLanguageAd2 = () => {
  const NativeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { AddConfig } = useSelector(state => state.remoteConfigReducer);
console.log(Config.NativeLanguage)
  const loadAd = useCallback(() => {
    if (AddConfig.NativeLanguage) {
      setIsLoading(true);
      setError(false);
      NativeRef.current.loadAd();
    } else {
      setIsLoading(false);
    }
  }, [AddConfig.NativeLanguage]);

  useFocusEffect(
    useCallback(() => {
      loadAd();
    }, [loadAd])
  );

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        loadAd();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [loadAd]);

  useEffect(() => {
    loadAd();
  }, [AddConfig.NativeLanguage, loadAd]);

  return (
   
    <NativeAdView
      style={{
        width: SCREEN_WIDTH,
        alignSelf: 'center',
      }}
     
      ref={NativeRef}
      refreshInterval={2000}
      onNativeAdLoaded={(error) => {
        //console.log('ADD LOADED FAILED IN LANGUAGE 2 AD',error)
        setIsLoading(false);
      }}
      onAdFailedToLoad={() => {
        setError(true);
        setIsLoading(false);
      }}
      adUnitID={AddConfig.NativeLanguage ? Config.NativeLanguage : ''}>
      {isLoading ? (
        
        <View
          style={{
            opacity: isLoading || error ? 1 : 0,
            backgroundColor: '#0000',
            borderColor: '#ADD8E6',
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 5,
          }}>
          <ShimmerPlaceholder>
            <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
          </ShimmerPlaceholder>
          <View style={styles.rowView}>
            <ShimmerPlaceholder style={styles.shimerIcon}>
              <IconView style={styles.iconView} />
            </ShimmerPlaceholder>
            <View
              style={{
                marginLeft: 5,
              }}>
              <ShimmerPlaceholder>
                <HeadlineView numberOfLines={2} style={styles.headingTitle} />
              </ShimmerPlaceholder>
              <ShimmerPlaceholder>
                <TaglineView numberOfLines={3} style={styles.taglineText} />
              </ShimmerPlaceholder>
            </View>
          </View>
          <ShimmerPlaceholder style={styles.ImageViewShimmer}>
            <ImageView style={styles.imageView} />
          </ShimmerPlaceholder>
          <ShimmerPlaceholder style={styles.calltoactionshimmer}>
            <CallToActionView
              buttonAndroidStyle={styles.buttonAndroidStyle}
              style={styles.CallToActionView}
              textStyle={styles.CallToActionViewText}
            />
          </ShimmerPlaceholder>
        </View>
       
      ) : (
        <View>
          {AddConfig.NativeLanguage ? (
            <View
              style={{
                opacity: isLoading || error ? 0 : 1,
                backgroundColor: '#0000',
                borderColor: '#ADD8E6',
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingTop: 10,
                paddingBottom: 5,
              }}>
              <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
              <View style={styles.rowView}>
                <IconView style={styles.iconView} />
                <View
                  style={{
                    marginLeft: 5,
                  }}>
                  <HeadlineView numberOfLines={2} style={styles.headingTitle} />
                  <TaglineView numberOfLines={3} style={styles.taglineText} />
                </View>
              </View>
              <ImageView style={styles.imageView} />
              <CallToActionView
                buttonAndroidStyle={styles.buttonAndroidStyle}
                style={styles.CallToActionView}
                textStyle={styles.CallToActionViewText}
              />
            </View>
          ) : null}
        </View>
        
      )}
      
    </NativeAdView>
   
  );
};

const styles = StyleSheet.create({
  rowView: {
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    padding: 5,
  },
  iconView: {
    right: 10,
    width: 50,
    height: 50,
  },
  headingTitle: {
    color: '#060606',
    fontWeight: '900',
    flexDirection: 'column',
    flexWrap: 'wrap',
    fontSize: 12,
  },
  taglineText: {
    fontFamily: fonts.Medium,
    fontSize: 9,
    color: '#060606',
    width: wp(70),
  },
  AdBadge: {
    width: 22,
    height: 16,
    borderWidth: 1,
    backgroundColor: '#3972FE',
    borderColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  AdBadgeText: {
    fontSize: 10,
    color: '#fff',
    includeFontPadding: false,
  },
  imageView: {
    backgroundColor: '#0001',
    width: SCREEN_WIDTH - 20,
    marginBottom: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    resizeMode: 'center',
  },
  CallToActionViewText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.Medium,
  },
  CallToActionView: {
    height: 36,
    width: SCREEN_WIDTH - wp(15),
    backgroundColor: '#3972FE',
    borderRadius: 100,
  },
  buttonAndroidStyle: {
    backgroundColor: '#3972FE',
    borderColor: '#3972FE',
    borderWidth: 1,
    borderRadius: 100,
  },
  
  noAdView: {
    height: 230,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimerIcon:{
    width: 50,
    height: 50,
  },
  calltoactionshimmer:{
    height: 36,
    width: SCREEN_WIDTH - wp(15),
  },
  ImageViewShimmer:{
    height: 120,
  }
});

export default NativeAdLanguageAd2;
