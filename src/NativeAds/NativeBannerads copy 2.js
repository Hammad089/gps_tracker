import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, AppState } from 'react-native';
import NativeAdView, {
  AdBadge,
  CallToActionView,
  HeadlineView,
  IconView,
  TaglineView,
} from 'react-native-admob-native-ads';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../constants/font';
import { useSelector } from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const SCREEN_WIDTH = wp(100);

export const NativeBanner = React.memo(({ media, type, myindex = 0 }) => {
  const {AddConfig} = useSelector(state=>state.remoteConfigReducer);
 
console.log(myindex,'cgcg');
///console.log('AFFAFAFAF',AddConfig)
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef();
  const onAdFailedToLoad = event => {
    console.log(event , 'FAILED');
    setError(true);
    setLoading(false);
    setLoaded(false);
  };

  const onNativeAdLoaded = event => {
    console.log('Unified ad Recieved', event);
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
  };

  useEffect(() => {    
  }, [myindex]);
  return (
    <NativeAdView
      style={{
        width: SCREEN_WIDTH,
        alignSelf: 'center',
        backgroundColor: '#fff',
      }}
      ref={nativeAdRef}
      refreshInterval={2000}
      onNativeAdLoaded={onNativeAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      repository="imageAd"
    >
      {loading ? (
        <View style={styles.loadingView}>
          <ShimmerPlaceholder>
            <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
          </ShimmerPlaceholder>
          <View style={styles.rowView}>
            <View style={styles.left}>
              <View style={styles.right}></View>
              <View style={{ flexDirection: 'row' }}>
                <ShimmerPlaceholder>
                  <IconView style={styles.iconView} />
                </ShimmerPlaceholder>
                <View style={{ marginLeft: 5, paddingTop: 5 }}>
                  <ShimmerPlaceholder>
                    <HeadlineView numberOfLines={2} style={styles.headingTitle} />
                  </ShimmerPlaceholder>
                  <ShimmerPlaceholder>
                    <TaglineView numberOfLines={3} style={styles.taglineText} />
                  </ShimmerPlaceholder>
                </View>
              </View>
            </View>
          </View>
          <ShimmerPlaceholder>
            <CallToActionView
              style={styles.CallToActionView}
              buttonAndroidStyle={styles.buttonAndroidStyle}
              textStyle={styles.CallToActionViewText}
            />
          </ShimmerPlaceholder>
        </View>
      ) : (
        <View>
          {AddConfig.NativeIntro ? (
            <View style={styles.adView}>
              <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
              <View style={styles.rowView}>
                <View style={styles.left}>
                  <View style={styles.right}></View>
                  <View style={{ flexDirection: 'row' }}>
                    <IconView style={styles.iconView} />
                    <View style={{ marginLeft: 5, paddingTop: 5 }}>
                      <HeadlineView numberOfLines={2} style={styles.headingTitle} />
                      <TaglineView numberOfLines={3} style={styles.taglineText} />
                    </View>
                  </View>
                </View>
              </View>
              <CallToActionView
                style={styles.CallToActionView}
                buttonAndroidStyle={styles.buttonAndroidStyle}
                textStyle={styles.CallToActionViewText}
              />
            </View>
          ) : null}
        </View>
      )}
    </NativeAdView>
  );
});

const styles = StyleSheet.create({
  loadingView: {
    opacity: 1,
    backgroundColor: '#0000',
    borderColor: '#ADD8E6',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  adView: {
    opacity: 1,
    backgroundColor: '#0000',
    borderColor: '#ADD8E6',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  rowView: {
    width: SCREEN_WIDTH - 20,
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconView: {
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
    fontSize: 12,
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
  CallToActionViewText: {
    color: 'white',
    fontSize: 18,
    includeFontPadding: false,
    fontWeight: '800',
    fontFamily: fonts.Medium,
  },
  CallToActionView: {
    height: 40,
    width: SCREEN_WIDTH - wp(25),
    backgroundColor: '#3972FE',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAndroidStyle: {
    backgroundColor: '#3972FE',
    borderColor: '#3972FE',
    borderWidth: 1,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAdView: {
    height: 230,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
