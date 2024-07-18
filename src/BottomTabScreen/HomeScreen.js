import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useInterstitialAd } from 'react-native-google-mobile-ads';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../../env';
import LocatonMapIcon from '../assets/svgs/LocationMap.svg';
import StationAlertIcon from '../assets/svgs/StationAlert.svg';
import FacebookIcon from '../assets/svgs/facebook.svg';
import FindAddressIcon from '../assets/svgs/findaddressIcon.svg';
import GPSIcon from '../assets/svgs/gps_cordinates.svg';
import InstagramIcon from '../assets/svgs/instagram1.svg';
import WhatsappIcon from '../assets/svgs/whatsapp.svg';
import CustomHeader from '../components/CustomHeader';
import fonts from '../constants/font';
import { AuthRoutes } from '../constants/routes';
import { AddCountAction } from '../store/actions/AddCountAction';
import { setLocation } from '../store/actions/userAction';
import NetInfo,{addEventListener} from '@react-native-community/netinfo';
import NoInternet from '../assets/svgs/no-internet.svg'
const HomeScreen = () => {
  const {AddConfig} = useSelector(state => state.remoteConfigReducer);
  const [isConnected , setIsConnected] = useState(false)
  ///console.log('ADDDDDD',AddConfig)
  const {count} = useSelector(state => state.AddReducer);
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] =
    React.useState(true);
  const [loading, setloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [findaddressloading,setFindaddressloading] = useState(false);
  const [gpscoordinateloading,setGpsCoordinateLoading] = useState(false)
  const dispatch = useDispatch();
  const {isLoaded, isClosed, load, show, isOpened, isShowing, error} =
    useInterstitialAd(AddConfig.InterHome ? Config.InterHome : '');
  const [route, setRoute] = useState(null);
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const navigation = useNavigation();
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    fetchCurrentAddress();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
          Alert.alert('Hold on!', 'Do you really want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp()},
          ]);
          return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  useEffect(() => {
    if (error !== undefined) {
      setIsLoading(false);
      setloading(false);
      setFindaddressloading(false);
      setGpsCoordinateLoading(false)
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
      setloading(false);
      setFindaddressloading(false)
      setGpsCoordinateLoading(false)
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
      navigation.navigate(route);
    }
  }, [isOpened, route]);

  const handleGpsTracker = routeName => {
    if (AddConfig.InterHome) {
      if (count % 3 === 0) {
        if (routeName === AuthRoutes.gpstracker) {
          setIsLoading(true);
        } else if(routeName === AuthRoutes.stationalert) {
          setloading(true);
        }
        else if(routeName === AuthRoutes.findaddress) {
          setFindaddressloading(true)
        }
        else if(routeName === AuthRoutes.gpscordinatescreen){
          setGpsCoordinateLoading(true)
        }
        dispatch(AddCountAction());
        load();
        setRoute(routeName);
      } else {
        dispatch(AddCountAction());
        navigation.navigate(routeName);
      }
    } else {
      navigation.navigate(routeName);
    }
  };

  const openWhatsApp = async () => {
    const latitude = latitude;
    const longitude = longitude;
    const supported = await Linking.openURL(
      'whatsapp://send?text=install GPS Tracker,https://play.google.com/store/apps/details?id=com.gpstracker.number.locationtracker',
    );
    if (supported) {
      console.log('WHATS APP installled');
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
    } else {
      console.log('WhatsApp not installed');
    }
  };

  const openFacebook = () => {
    Linking.openURL('https://www.facebook.com/');
    AsyncStorage.setItem('canShowAppOpenAd', 'false');
  };

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/');
    AsyncStorage.setItem('canShowAppOpenAd', 'false');
  };

  const fetchCurrentAddress = () => {
    Geolocation.getCurrentPosition(
      position => {
        dispatch(setLocation(position));
        const {latitude, longitude} = position.coords;
        getAddressFromCoords(latitude, longitude);
      },
      error => {
        console.error(error.message);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };
  const getAddressFromCoords = (latitude, longitude) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1&accept-language=en`,
    )
      .then(response => response.json())
      .then(data => {
        setCurrentAddress(data?.display_name);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addressLines = currentAddress.split(',');
  const firstLine = addressLines.slice(0, 5).join(',');

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected)
      setIsLoading(false);
      setloading(false)
    })

    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected)
      setIsLoading(false)
      setloading(false)
    });
    return() => {
      unsubscribe();
    }
  },[isConnected])

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
            GPS{' '}
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: RFValue(20),
                fontFamily: fonts.SemiBold,
                fontWeight: '700',
              }}>
              Tracker
            </Text>
          </Text>
        </View>
      </View>
     {
      isConnected ? (
        <>
        <View>
        <Text
          ellipsizeMode={'tail'}
          numberOfLines={2}
          style={{
            color: '#1E1F4B',
            fontSize: RFValue(12),
            fontFamily: fonts.Light,
            fontWeight: '400',
            textAlign: 'center',
            margin: 13,
          }}>
          {firstLine}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => handleGpsTracker(AuthRoutes.gpstracker)}>
          <View style={styles.GPSContainer}>
            <LocatonMapIcon
              height={50}
              width={50}
              style={styles.LocatonMapIcon}
            />
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: RFValue(12),
                  paddingLeft: 30,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                {selectedLanguage.GPSTracker}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.StationAlertIcon}>
          <TouchableOpacity
            onPress={() => handleGpsTracker(AuthRoutes.stationalert)}>
            <StationAlertIcon
              height={50}
              width={50}
              style={styles.LocatonMapIcon}
            />
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: RFValue(12),
                  paddingLeft: 35,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                {selectedLanguage.station_Alert}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{flexDirection: 'row', gap: 10, marginLeft: 10, marginTop: 10}}>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: RFValue(12),
            fontFamily: fonts.Bold,
            fontWeight: '700',
          }}>
          {selectedLanguage.Share_Location}
        </Text>
        {/* <View style={{flexDirection: 'row', gap: 5, marginBottom: 5}}>
          <BatterIcon width={15} height={15} style={styles.batteryIcon} />
          <Text style={{fontSize: 8, marginTop: 5}}> {batteryLevel !== null ? batteryLevel.toFixed() + '%' : 'Loading...'}</Text>
        </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: 12,
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8,
        }}>
        <TouchableOpacity onPress={() => openWhatsApp()}>
          <View style={styles.whatsappcontainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
                marginTop: 13,
                gap: 5,
              }}>
              <WhatsappIcon width={24} height={24} />
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: RFValue(12),
                  fontFamily: fonts.SemiBold,
                  fontWeight: '700',
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedLanguage.Whatsapp}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openFacebook()}>
          <View style={styles.FacebookContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
                marginTop: 13,
                gap: 5,
              }}>
              <FacebookIcon width={24} height={24} />
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: RFValue(12),
                  fontFamily: fonts.SemiBold,
                  fontWeight: '700',
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedLanguage.Facebook}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openInstagram()}>
          <View style={styles.InstagramContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 12,
                marginTop: 13,
                gap: 5,
              }}>
              <InstagramIcon width={24} height={24} />
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: RFValue(12),
                  fontFamily: fonts.SemiBold,
                  fontWeight: '700',
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedLanguage.Instagram}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: 15,
            fontFamily: fonts.Bold,
            margin: 15,
            fontWeight: '700',
            marginLeft: 10,
          }}>
          Other Function
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleGpsTracker(AuthRoutes.findaddress)}>
        <View style={{flexDirection: 'row', marginLeft: 8, gap: 10}}>
          <View style={styles.findaddressIcon}>
            <FindAddressIcon width={40} height={40} style={styles.icon} />
          </View>
         {
          findaddressloading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
          ):(
            <Text
            style={{
              color: '#1E1F4B',
              fontSize: RFValue(14),
              fontFamily: fonts.Bold,
              marginTop: 20,
              fontWeight: '700',
            }}>
            {selectedLanguage.FindAddress}
          </Text>
          )
         }
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleGpsTracker(AuthRoutes.gpscordinatescreen)}>
        <View style={{flexDirection: 'row', marginLeft: 8, gap: 10}}>
          <View style={styles.gpscoordinateicon}>
            <GPSIcon width={65} height={65} style={styles.gpscoordinateIcoon} />
          </View>
          {
            gpscoordinateloading ? (
              <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
            ):(
              <Text
            style={{
              color: '#1E1F4B',
              fontSize: RFValue(14),
              fontFamily: fonts.Bold,
              fontWeight: '700',
              marginTop: 40,
            }}>
            {selectedLanguage.GPS_Coordinate}
          </Text>
            )
          }
        </View>
      </TouchableOpacity>
      </>
      ):(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <NoInternet width={100} height={100} />
          <Text style={{
            marginTop:10,
            fontSize:RFValue(14),
            color:'red'
          }}>No Internet</Text>
        </View>
      )
     }
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  GPSContainer: {
    margin: 8,
    alignSelf: 'center',
    marginHorizontal: 5,
    backgroundColor: '#F9F9F9',
    width: wp('45%'),
    height: hp('11%'),
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
    },
    borderRadius: 17,
  },
  StationAlertIcon: {
    margin: 8,
    backgroundColor: '#F9F9F9',
    width: wp('45%'),
    height: hp('11%'),
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
    },
    borderRadius: 17,
  },
  LocatonMapIcon: {
    marginHorizontal: 30,
    margin: 5,
  },
  batteryIcon: {
    marginTop: 3,
  },
  whatsappcontainer: {
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  FacebookContainer: {
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  InstagramContainer: {
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  findaddressIcon: {
    backgroundColor: '#F9F9F9',
    width: 80,
    height: 70,
    shadowOffset: {
      height: 1,
    },
    borderRadius: 10,
  },
  findaddressIcon1: {
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    width: 80,
    height: 70,
    shadowOffset: {
      height: 1,
    },
    borderRadius: 10,
  },
  icon: {
    alignItems: 'center',
    marginLeft: 17,
    marginTop: 12,
  },
  gpscoordinateicon: {
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    width: 80,
    height: 70,
    shadowOffset: {
      height: 1,
    },
    borderRadius: 10,
  },
  gpscoordinateIcoon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
});
