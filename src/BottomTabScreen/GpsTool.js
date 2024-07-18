import {StyleSheet, Text, TouchableOpacity, View, Platform,ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import HumbergIcon from '../assets/svgs/Humberg.svg';
import fonts from '../constants/font';
import AreaCodeIcon from '../assets/svgs/areacode.svg';
import CompassIcon from '../assets/svgs/compass.svg';
import AlltitudeIcon from '../assets/svgs/AltitudeMeter.svg';
import WorldClockIcon from '../assets/svgs/worldclock1.svg';
import IpAddressIcon from '../assets/svgs/IpAddress.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import CustomHeader from '../components/CustomHeader';
import {useDispatch, useSelector} from 'react-redux';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';
import Config from '../../env';
import { AddCountAction } from '../store/actions/AddCountAction';
const GpsTool = () => {
  const {AddConfig} = useSelector(state=>state.remoteConfigReducer);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {isLoaded, isClosed, load, show, isOpened, isShowing, error} =
    useInterstitialAd(AddConfig.InterHome ? Config.InterHome : '');
  const [route, setRoute] = useState(null);
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const {count} = useSelector(state => state.AddReducer);
  //console.log('selected',selectedLanguage);
  const navigation = useNavigation();
  useEffect(() => {
    if (error !== undefined) {
      setIsLoading(false);
      AsyncStorage.setItem('canShowAppOpenAd', 'true');
      navigation.navigate(route);
    }
  }, [error]);

  useEffect(() => {
    if (isLoaded) {
      show();
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isClosed) {
      AsyncStorage.setItem('canShowAppOpenAd', 'true');
    }
  }, [isClosed]);

  useEffect(() => {
    if (isOpened) {
      setIsLoading(false);
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
      navigation.navigate(route);
    }
  }, [isOpened, route]);
  const handleAreaCode = routeName => {
    if(AddConfig.InterHome){
    if(count % 3 == 0) {
      load();
      setIsLoading(false)
      dispatch(AddCountAction())
     setRoute(routeName);
    }
    else {
      dispatch(AddCountAction())
      navigation.navigate(routeName);
    }
  }
  else{
    navigation.navigate(routeName)
  }
  
};

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', columnGap: 10}}>
        <CustomHeader />
        <View style={{marginTop: 15}}>
          <Text
            style={{
              color: '#3972FE',
              fontSize: RFValue(20),
              fontFamily: fonts.SemiBold,
              fontWeight: '700',
            }}>
            GPS
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: RFValue(20),
                fontFamily: fonts.SemiBold,
                fontWeight: '700',
              }}>
              Tool
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap:10,
          marginLeft:20
        }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={()=>handleAreaCode(AuthRoutes.areacode)}>
            <AreaCodeIcon width={50} height={50} style={styles.AreacodeIcon} />
                <Text
              style={{
                color: '#1E1F4B',
                fontSize: 13,
                fontFamily: fonts.Bold,
                fontWeight: '700',
                marginLeft: 20,
                bottom: 7,
              }}>
              {selectedLanguage.areacode}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={()=>handleAreaCode(AuthRoutes.compass)}>
            <CompassIcon width={50} height={50} style={styles.AreacodeIcon} />
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 13,
                fontFamily: fonts.Bold,
                fontWeight: '700',
                marginLeft: 20,
                bottom: 7,
              }}>
              {selectedLanguage.compass}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={()=>handleAreaCode(AuthRoutes.allitudemeter)}>
            <AlltitudeIcon width={50} height={50} style={styles.AreacodeIcon} />
          </TouchableOpacity>
          <Text
            style={{
              color: '#1E1F4B',
              fontSize: 13,
              fontFamily: fonts.Bold,
              fontWeight: '700',
              marginLeft: 20,
              bottom: 7,
            }}>
            {selectedLanguage.altitudemeter}
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={()=>handleAreaCode(AuthRoutes.worldclock)}>
            <WorldClockIcon
              width={50}
              height={50}
              style={styles.AreacodeIcon}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: '#1E1F4B',
              fontSize: 13,
              fontFamily: fonts.Bold,
              fontWeight: '700',
              marginLeft: 20,
              bottom: 7,
            }}>
            {selectedLanguage.worldclock}
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={()=>handleAreaCode(AuthRoutes.ipmacaddress)}>
            <IpAddressIcon width={50} height={50} style={styles.AreacodeIcon} />
          </TouchableOpacity>
          <Text
            style={{
              color: '#1E1F4B',
              fontSize: 13,
              fontFamily: fonts.Bold,
              fontWeight: '700',
              marginLeft: 20,
              bottom: 7,
            }}>
            {selectedLanguage.ipaddress}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GpsTool;

const styles = StyleSheet.create({
  HumbergIcon: {
    margin: 15,
  },
  container: {
    marginTop:15,
    width: wp('43%'),
    backgroundColor: '#F9F9F9',
    height: hp('13%'),
    borderRadius: 17,
    marginBottom: 10,
  },
  AreacodeIcon: {
    margin: 15,
  },
  loadingContainer:{
    alignItems:'center'
  }
});
