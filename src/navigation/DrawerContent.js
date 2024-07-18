import React from 'react';
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import fonts from '../constants/font';
import route_data from './drawer_data';
const DrawerContent = ({navigation}) => {
 
  const rateUs = async () => {
    AsyncStorage.setItem('canShowAppOpenAd', 'false')
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.gpstracker.number.locationtracker',
     
    );
  };

  const privacyPolicy = async () => {
    AsyncStorage.setItem('canShowAppOpenAd', 'false')
    Linking.openURL(
      'https://sites.google.com/view/phonetracker-privacypolicy/home',
    )
  };

  // const EULA = async () => {
  //   Linking.openURL(
  //     'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  //   ).catch(err => {

  //   });
  // };

  const shareApp = async () => {
    AsyncStorage.setItem('canShowAppOpenAd', 'false')
    try {
      const result = await Share.share({
        message: `GPS Tracker: Install GPS Tracker and Track all your jounrey.https://play.google.com/store/apps/details?id=com.gpstracker.number.locationtracker`,
      });
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.imgBg}>
      <View>
        <TouchableOpacity
          onPress={() => {
            console.log('Toggle drawer pressed');
            navigation.toggleDrawer();
          }}>
          <AntDesign name="arrowleft" style={styles.leftArrow} size={30} />
        </TouchableOpacity>
      </View>
        <Image
          source={require('../assets/images/splashIcon2.png')}
          style={{
            resizeMode: 'cover',
            width: 150,
            borderRadius: 100,
            height: 150,
            marginTop:50
          }}
        />
      </View>
      {route_data.map((item, index) => (
        <TouchableOpacity
          key={`${index}`}
          style={styles.btnView}
          onPress={() => {
            if (item.type == 'route') {
              navigation.navigate(item.route);
            } else {
              // dispatch(setCanShowAppOpenAds(false));
              if (item.route == 'rateUs') {
                rateUs();
              } else if (item.route == 'privacyPolicy') {
                privacyPolicy();
              } else if (item.route == 'shareApp') {
                shareApp();
              }
              // else {
              //   EULA();
              // }
            }
          }}>
          {item.icon}
          <Text style={styles.textStyle}>{item.label}</Text>
          <Entypo
            size={wp(6)}
            style={{position: 'absolute', right: wp(3)}}
            name={'chevron-small-right'}
            color={'#1E1F4B'}
          />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};
export default DrawerContent;

const styles = StyleSheet.create({
  SafeAreaView: {
    backgroundColor: '#fff',
    flex: 1,
    // width:wp(100)
  },

  btnView: {
    paddingLeft: wp(5),
    height: hp(7),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#0001',
    width: '100%',
    alignItems: 'center',
  },
  imgBg: {
    width: '100%',
    flexDirection:'row',
    columnGap:100,
    marginTop:20,
    borderBottomWidth: 2,
    borderBottomColor: '#0001',
    marginBottom: 20,
    height: 250,
  },
  textStyle: {
    marginLeft: wp(4),
    fontFamily: fonts.Medium,
    color: '#000000D0',
    width: wp(40),
    fontSize: 14,
    includeFontPadding: false,
  },
  leftArrow:{
    marginTop:30,
    marginLeft:10
  }
});
