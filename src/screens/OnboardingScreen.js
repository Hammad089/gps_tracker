import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PERMISSIONS, openSettings, request } from 'react-native-permissions';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import Onboarding from '../components/Onboarding';
import fonts from '../constants/font';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import { setHomeScreen } from '../store/actions/userAction';

const Simple = () => {
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('onboarding'));
  }, []);
  const navigation = useNavigation();
  const [isEnabledLocation, setIsEnabledLocation] = useState(false);
  const [isEnabledContact, setIsEnabledContact] = useState(false);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);
  const [isContactPermissionGranted, setIsContactPermissionGranted] =
    useState(false);

  const checkPermissionStatus = async () => {
    const locationStatus = await AsyncStorage.getItem('locationPermission');
    setIsLocationPermissionGranted(locationStatus === 'granted');
    setIsEnabledLocation(locationStatus === 'granted');

    const contactStatus = await AsyncStorage.getItem('contactPermission');
    setIsContactPermissionGranted(contactStatus === 'granted');
    setIsEnabledContact(contactStatus === 'granted');
  };

  useEffect(() => {
    checkPermissionStatus();
    // checkFirstTimeOpening();
  }, []);
  // const checkFirstTimeOpening = async () => {
  //   const isFirstTime = await AsyncStorage.getItem('isFirstTime');
  //   if (!isFirstTime) {
  //     // If it's the first time opening, set initial permissions and mark it as not the first time anymore
  //     await AsyncStorage.setItem('isFirstTime', 'false');
  //     await AsyncStorage.setItem('locationPermission', 'pending'); // or any initial state you want
  //     await AsyncStorage.setItem('contactPermission', 'pending'); // or any initial state you want
  //     // Reset state to initial values
  //     setIsLocationPermissionGranted(false);
  //     setIsEnabledLocation(false);
  //     setIsContactPermissionGranted(false);
  //     setIsEnabledContact(false);
  //   }
  // };

  const toggleSwitch = async () => {
    if (!isLocationPermissionGranted) {
      requestLocationPermission();
    }
  };

  const toggleSwitchContact = async () => {
    if (!isContactPermissionGranted) {
      requestContactPermission();
    }
  };

  const requestLocationPermission = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } else {
      permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    if (permission === 'granted') {
      AsyncStorage.setItem('locationPermission', 'granted');
      setIsLocationPermissionGranted(true);
      requestContactPermission()
      setIsEnabledLocation(true);
    } else if (permission === 'denied') {
      Alert.alert(
        'Location permission denied',
        'Please grant location permission to continue using the app.',
        [
          {
            text: 'OK',
            onPress: () => requestLocationPermission(),
          },
        ],
      );
    } else if (permission === 'blocked') {
      Alert.alert(
        'Location permission blocked',
        'You have denied location permission multiple times. Please enable it from device settings to use the app.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Close the app
              // BackHandler.exitApp();
              openSettings().catch(() => console.log('Setting cannot Open'));
            },
          },
        ],
      );
    }
  };

  const requestContactPermission = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = await request(PERMISSIONS.IOS.CONTACTS);
    } else {
      permission = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
    }
    if (permission === 'granted') {
      AsyncStorage.setItem('contactPermission', 'granted');
      setIsContactPermissionGranted(true);
      setIsEnabledContact(true);
    } else if (permission === 'denied') {
      Alert.alert(
        'Contact permission denied',
        'Please grant contact permission to continue using the app.',
        [
          {
            text: 'OK',
            onPress: () => requestContactPermission(),
          },
        ],
      );
    } else if (permission === 'blocked') {
      Alert.alert(
        'Contact permission blocked',
        'You have denied contact permission multiple times. Please enable it from device settings to use the app.',
        [
          {
            text: 'OK',
            onPress: () => {
              openSettings().catch(() => console.log('Setting cannot open'));
            },
          },
        ],
      );
    }
  };
  

  const navigateToMainScreen = () => {
    if (!isContactPermissionGranted || !isLocationPermissionGranted) {
      Alert.alert(
        'Permission Required',
        'Please grant both location and contact permissions to proceed.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Grant Permissions',
            onPress: () => {
              if (!isLocationPermissionGranted) {
                requestLocationPermission();
              }
              if (!isContactPermissionGranted) {
                requestContactPermission();
              }
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      dispatch(setHomeScreen(true));
      // navigation.navigate(AuthRoutes.MainScreen);
    }
  };
  const CustomButton = ({label, onPress}) => (
    <TouchableOpacity style={{marginHorizontal: 10}} onPress={onPress}>
      <Text style={{
        color:'#3972FE',
        fontSize:RFValue(16),
        fontWeight:'bold'
      }}>Let's Go</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{width: wp(100), height: hp(100)}}>
          <Onboarding
            showSkip={false}
            skipToPage={0}
            onDone={navigateToMainScreen}
            bottomBarHighlight={false}
            // NextButtonComponent={CustomButton}
             DoneButtonComponent={CustomButton}
            ///onSwipePageChange={onSwipePageChange}
            showNext={false}
            pages={[
              {
                backgroundColor: '#fff',
                image: (
                  <Image
                    source={require('../assets/images/GPSTracker1.png')}
                    resizeMode={'center'}
                    style={{
                      height: hp(40),
                      width: wp(60),
                      alignItems:'center',
                      alignSelf:'center'
                    }}
                  />
                ),
                title: (
                  <Text style={{marginTop: 15}}>
                    <Text
                      style={{
                        color: '#3972FE',
                        fontWeight: 'bold',
                        fontSize: 26,
                      }}>
                      GPS
                    </Text>
                    <Text
                      style={{
                        color: '#1E1F4B',
                        fontWeight: 'bold',
                        fontSize: 26,
                      }}>
                      Tracker
                    </Text>
                  </Text>
                ),
                subtitle: (
                  <Text
                    style={{
                      color: '#1E1F4B',
                      fontSize: RFValue(14),
                      fontFamily: fonts.Medium,
                      fontWeight: '500',
                      textAlign: 'center',
                      margin: 10,
                    }}
                    ellipsizeMode={'middle'}>
                    {selectedLanguage.GPSTracker_real_time_location}
                  </Text>
                ),
              },
              {
                backgroundColor: '#fff',
                image: (
                  <Image
                    source={require('../assets/images/stationalert.png')}
                    style={{
                      height: hp(40),
                      resizeMode: 'center',
                      width: wp(60),
                    }}
                  />
                ),
                title: (
                  <Text style={{}}>
                    <Text
                      style={{
                        color: '#3972FE',
                        fontWeight: 'bold',
                        fontSize: RFValue(26),
                      }}>
                      Station
                    </Text>
                    <Text
                      style={{
                        color: '#1E1F4B',
                        fontWeight: 'bold',
                        fontSize: RFValue(26),
                      }}>
                      {' '}
                      Alert
                    </Text>
                  </Text>
                ),
                subtitle: (
                  <Text
                    style={{
                      color: '#1E1F4B',
                      fontSize: RFValue(12),
                      margin: 12,
                      fontWeight: '500',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 10,
                      fontFamily: fonts.Medium,
                    }}>
                    {selectedLanguage.Noftify_you}
                    {'\n'}
                    <Text style={{textAlign: 'center'}}></Text>
                  </Text>
                ),
              },
              {
                backgroundColor: '#fff',
                image: (
                  <Image
                    resizeMode={'center'}
                    source={require('../assets/images/numbertracker.png')}
                    style={{
                      height: hp(40),
                      resizeMode: 'center',
                      width: wp(60),
                    }}
                  />
                ),
                title: (
                  <Text style={{}}>
                    <Text
                      style={{
                        color: '#3972FE',
                        fontWeight: 'bold',
                        fontSize: RFValue(26),
                      }}>
                      Number
                    </Text>
                    <Text
                      style={{
                        color: '#1E1F4B',
                        fontWeight: 'bold',
                        fontSize: RFValue(26),
                      }}>
                      {' '}
                      Tracker
                    </Text>
                  </Text>
                ),
                subtitle: (
                  <Text
                    style={{
                      color: '#1E1F4B',
                      fontSize: RFValue(12),
                      margin: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginTop: 10,
                      fontFamily: fonts.Medium,
                    }}>
                    {selectedLanguage.Got_Number_Details}
                    {'\n'}
                  </Text>
                ),
              },
              {
                backgroundColor: '#fff',
                image: (
                  <Image
                    source={require('../assets/images/permission.png')}
                    style={{
                      height: hp(40),
                      resizeMode: 'center',
                      width: wp(60),
                    }}
                  />
                ),
                title: (
                  <>
                    <View style={styles.permissionContainer}>
                      <Text style={styles.locationText}>
                        {selectedLanguage.Location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp(90),
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            paddingLeft: 12,
                            color: '#1E1F4B',
                            fontSize: RFValue(16),
                            fontWeight: '700',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {selectedLanguage.Allow_permission}
                        </Text>
                        <Switch
                          trackColor={{false: '#767577', true: 'green'}}
                          thumbColor={isEnabledLocation ? '#E8F5E9' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitch}
                          value={isEnabledLocation}
                        />
                      </View>
                    </View>

                    <View style={styles.permissionContainer1}>
                      <Text style={styles.contactText}>
                        {selectedLanguage.Contact}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp(90),
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            marginTop: 5,
                            paddingLeft: 12,
                            color: '#1E1F4B',
                            fontSize: RFValue(16),
                            fontWeight: '700',
                          }}>
                          {selectedLanguage.Allow_permission}
                        </Text>
                        <Switch
                          trackColor={{false: '#767577', true: 'green'}}
                          thumbColor={isEnabledContact ? '#E8F5E9' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitchContact}
                          value={isEnabledContact}
                        />
                      </View>
                    </View>
                  </>
                ),
                subtitle: <View></View>,
              },
            ]}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  ArrowIcon: {
    position: 'absolute',
    top: 10,
    left: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    backgroundColor: '#F9F9F9',
    width: '90%',
    height: 60,
    justifyContent: 'center',
    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  permissionContainer1: {
    marginBottom: 25,
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    width: '90%',
    height: 60,
    justifyContent: 'center',
    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  locationText: {
    marginLeft: 10,
    color: '#1E1F4B',
    fontSize: 14,
  },
  contactText: {
    marginLeft: 10,
    color: '#1E1F4B',
    fontSize: RFValue(14),
  },
});
export default Simple;