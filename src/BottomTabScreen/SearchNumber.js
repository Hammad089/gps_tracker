import AsyncStorage from '@react-native-async-storage/async-storage';
import { parsePhoneNumber } from 'libphonenumber-js';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useInterstitialAd } from 'react-native-google-mobile-ads';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../../env';
import SelectedIcon from '../assets/svgs/selected.svg';
import CountrySelectionModal from '../components/CountrySelectionModal';
import CustomHeader from '../components/CustomHeader';
import fonts from '../constants/font';
import { AuthRoutes } from '../constants/routes';
import { setIsKeyboardOpen } from '../store/actions/setAppopenstatus';
import NetInfo,{addEventListener} from '@react-native-community/netinfo';
import NoInternet from '../assets/svgs/no-internet.svg'
const SearchNumber = ({navigation, searchCountry}) => {
  const {AddConfig} = useSelector(state=>state.remoteConfigReducer)
  const [isConnected , setIsConnected] = useState(false)
  const dispatch = useDispatch();
  const toast = useToast();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        dispatch(setIsKeyboardOpen(true));
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        dispatch(setIsKeyboardOpen(false));
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const {isLoaded, isClosed, load, show, isOpened, isShowing, error} =
    useInterstitialAd(AddConfig.InterHome ? Config.InterHome : '');
  const [route, setRoute] = useState(null);
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const {country} = useSelector(state => state.countryReducer);
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'United State',
    callingCode: '1',
    code: 'PK',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobile_number, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataresult, setDataResult] = useState({
    country: '',
    capital: '',
    capital_latitude: '',
    capital_longitude: '',
    network: '',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
  });
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (error !== undefined) {
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
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
      navigation.navigate(route, {
        item: dataresult,
        selectedCountry: selectedCountry,
        mobile_number: mobile_number,
      });
    }
  }, [isOpened]);
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected)
      setLoading(false)
    })

    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected)
      setLoading(false)
    });
    return() => {
      unsubscribe();
    }
  },[isConnected])
  //console.log('DATA RESULT', dataresult);

  // const validatePhoneNumber = async (phoneNumber, countryCode) => {
  //   // console.log(phoneNumber, countryCode ,"SDSDDSDS");
  //   try {
  //     const number = await parsePhoneNumber(phoneNumber, countryCode);
  //     console.log(number);
  //     if (number.isValid()) {
  //       console.log('// Phone number is valid.');
  //       return true;
  //     } else {
  //       console.log('// Phone number is not valid.');
  //       return false;
  //     }
  //   } catch (e) {
  //     console.log('INVALID PHONE NUMBER', e);
  //     return false;
  //   }
  // };

  const SearchNumberOnline = async () => {
    toast.hideAll();
    if (!mobile_number) {
      toast.show('Please Enter a Number', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in | zoom-in',
      });
      return;
    }
    setLoading(true);
  
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
  
    var raw = JSON.stringify({
      local_number: mobile_number,
      country_iso2: selectedCountry?.code,
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('https://appredarseo.com/gpstracker/numbergps.php', requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        setDataResult(result);
        if (AddConfig.InterHome) {
          load();
          setRoute(AuthRoutes.numberdetail);
        } else {
          // Validate latitude and longitude
          if (result.latitude && result.longitude && !isNaN(result.latitude) && !isNaN(result.longitude)) {
            navigation.navigate(AuthRoutes.numberdetail, {
              item: result,
              selectedCountry: selectedCountry,
              mobile_number: mobile_number,
            });
          } else {
            toast.show('Invalid location data', {
              type: 'danger',
              placement: 'top',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          }
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'There is some error occurred',
          text2: `We are working hard to bring things working`,
          position: 'bottom',
        });
      });
  };
  const handleCountrySelection = country => {
    console.log(country);
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', columnGap: 10}}>
        <CustomHeader />
        <View style={{marginTop: 15}}>
          <Text
            style={{
              color: '#3972FE',
              fontSize: 20,
              fontFamily: fonts.SemiBold,
              fontWeight: '700',
            }}>
            Search
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 20,
                fontFamily: fonts.SemiBold,
                fontWeight: '700',
              }}>
              Number
            </Text>
          </Text>
        </View>
      </View>
     {
      isConnected ? (
        <>
        <View>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: 14,
            fontWeight: '700',
            fontFamily: fonts.Bold,
            marginLeft: 27,
            margin: 7,
          }}>
          {selectedLanguage.selectcountrycode}
        </Text>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.countrycodeContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <Text>
                {selectedCountry
                  ? `${selectedCountry.name} +${selectedCountry.callingCode}`
                  : 'Select Country'}
              </Text>
              <SelectedIcon width={15} height={15} />
            </View>
          </TouchableOpacity>
          {showDropdown && (
            <CountrySelectionModal
              visible={showDropdown}
              setDefaultCountry={handleCountrySelection}
              setVisible={setShowDropdown}
              searchCountry={searchCountry}
            />
          )}
        </View>
      </View>
      <View>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: 14,
            fontWeight: '700',
            fontFamily: fonts.Bold,
            marginLeft: 27,
            margin: 7,
          }}>
          {selectedLanguage.enterphonenumber}
        </Text>
        <View style={{margin: 10}}>
          <TextInput
            placeholder="Enter Number"
            placeholderTextColor={'#000'}
            style={styles.inputNumber}
            value={mobile_number}
            keyboardType="phone-pad"
            onChangeText={text => setMobileNumber(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.StartButton}
        onPress={() => SearchNumberOnline()}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontFamily: fonts.Bold,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{alignSelf: 'center'}}
            />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: fonts.Bold,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              {selectedLanguage.search}
            </Text>
          )}
        </Text>
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

export default SearchNumber;

const styles = StyleSheet.create({
  HumbergIcon: {
    margin: 15,
  },
  countrycodeContainer: {
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    width: '90%',
    height: 40,
    borderRadius: 10,
  },
  inputNumber: {
    padding: 10,
    color: '#1E1F4B',
    alignSelf: 'center',
    width: '92%',
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  StartButton: {
    margin: 15,
    marginLeft: 20,
    width: '90%',
    height: 50,
    backgroundColor: '#3972FE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    margin: 10,
    paddingVertical: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    width: '95%',
    height: 50,
    borderRadius: 10,

    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginBottom: 4,
  },
});