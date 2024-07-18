import { StyleSheet, Text, View } from 'react-native'
import React,{useRef} from 'react'
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const MyBannerAd = React.forwardRef((props, ref) => {
    const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    return (
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        ref={ref}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={props.onAdFailedtoLoad}
        onAdLoaded={props.onAdLoadToOpen}
        onAdClosed={error => {
          console.log('BANNER AD CLOSED TO FAILED');
        }}
        onAdOpened={error => {
          console.log('BANNER AD OPEN');
        }}
      />
    );
  });

export default MyBannerAd

const styles = StyleSheet.create({})