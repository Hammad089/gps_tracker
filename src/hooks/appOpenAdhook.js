import React, { useEffect, useState } from "react";
import { useInterstitialAd,AdEventType, InterstitialAd,TestIds } from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../../env";
import { useSelector } from "react-redux";
export function useAppOpenAd() {
  const {AddConfig} = useSelector(state=>state.remoteConfigReducer)
    const interstitialAd = InterstitialAd.createForAdRequest(AddConfig.SplashInter ? Config.SplashInter : '',{
        requestNonPersonalizedAdsOnly:false
    });
    
    const [adClosed,setadClosed] = useState(false);
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        const adEventListener1 = interstitialAd.addAdEventsListener(
            ({type, payload}) => {
              if (type === AdEventType.ERROR) {
      
                setLoading(false);
                
                AsyncStorage.setItem('canShowAppOpenAd', 'true');
              }
              if (type === AdEventType.LOADED) {
                
                AsyncStorage.setItem('canShowAppOpenAd', 'false');
                interstitialAd.show();
              }
              if(type === AdEventType.OPENED){
                
                AsyncStorage.setItem('canShowAppOpenAd', 'false');
              }
              if (type === AdEventType.CLOSED) {
                setadClosed(true);
                AsyncStorage.setItem('canShowAppOpenAd', 'true');
              }
      
            },
          );    
          return() => {
            interstitialAd.removeAllListeners(adEventListener1)
          }
    },[]);
    useEffect(() => {
        
        interstitialAd.load();
      }, []);

      return {
        adClosed,
        loading
      }
}
