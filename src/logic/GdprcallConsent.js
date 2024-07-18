import {getDeviceId} from 'react-native-device-info';
import {
  AdsConsent,
  AdsConsentDebugGeography,
} from 'react-native-google-mobile-ads';
const GdprcallConsent = async () => {
  
 return AdsConsent.requestInfoUpdate({
    tagForUnderAgeOfConsent: false,
    testDeviceIdentifiers: [getDeviceId()],
    debugGeography: __DEV__
      ? AdsConsentDebugGeography.EEA
      : AdsConsentDebugGeography.DISABLED,
  }).then(data => {
   return AdsConsent.loadAndShowConsentFormIfRequired().then(adsConsentInfo => {
      console.log(adsConsentInfo,'adsConsentInfoadsConsentInfoadsConsentInfo');
      // if(adsConsentInfo.status === 'REQUIRED'){
      //   return false
      // }
        return adsConsentInfo.canRequestAds;
    });
  });
};

export default GdprcallConsent;
