import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import CreateIcon from '../assets/svgs/createIcon.svg';
import DailIcon from '../assets/svgs/dialIcon.svg';
import MessageIcon from '../assets/svgs/messageIcon.svg';
import WhatsAppIcon from '../assets/svgs/whatsapp1.svg';
import fonts from '../constants/font';
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const NumberDetailScreen = ({navigation, route}) => {
  const items = route?.params?.item;
  const countrycode = route?.params?.selectedCountry;
  const number = route?.params?.mobile_number;
  console.log('ITEM NUMBER DETAIL', items);
  console.log('countrycode', countrycode);
  console.log('number', number);
  // const {country} = useSelector(state => state.countryReducer);
  // console.log('DATA in detaail screen',country);
  const [dataresult, setDataResult] = useState(route?.params?.item);
  const mapViewRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      animatedMaptoRegion({
        latitude: dataresult.capital_latitude,
        longitude: dataresult.capital_longitude,
        latitudeDelta: 7.5,
        longitudeDelta: 7.5,
      });
    }, 2000);
  });
  const animatedMaptoRegion = newLocation => {
    //console.log('NEW LOCATION', newLocation)
    if (mapViewRef) {
      mapViewRef?.current?.animateToRegion(newLocation, 4500);
    }
  };

  const handleContacts = () => {
    const phoneNumber = [{label: 'mobile', number: number}];
    AsyncStorage.setItem('canShowAppOpenAd', 'false');
    Contacts.openContactForm({
      phoneNumbers: phoneNumber,
    })
      .then(() => {
        console.log('Contact form opened successfully');
      })
      .catch(error => {
        console.error('Error opening contact form:', error);
      });
  }

  const takeAction = text => {
    if (text == 'Call') {
      Linking.openURL(`tel:${countrycode?.callingCode}${number}`);
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
    } else if (text == 'Message') {
      Linking.openURL(`sms:${countrycode?.callingCode}${number}`);
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
    } else if (text == 'WhatsApp') {
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
      Linking.openURL(
        `whatsapp://send?text="Here check out my app https://play.google.com/store/apps/details?id=com.gpstracker.number.locationtracker"&phone=${countrycode?.callingCode}${number}`,
      );
    } else {
      var newPerson = {
        phoneNumbers: [
          {
            label: 'mobile',
            number: `+${countrycode?.callingcode}${number}`,
          },
        ],

        familyName: name,
        givenName: name,
      };
      //Contacts.openContactForm(newPerson);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{margin: 20}}>
        <MapView
          style={{...StyleSheet.absoluteFillObject}}
          ref={mapViewRef}
          provider={'google'}
          initialRegion={{
            latitude: parseFloat(dataresult?.capital_latitude),
            longitude: parseFloat(dataresult?.capital_longitude),
            latitudeDelta: 0.2,
            longitudeDelta: 0.05,
          }}
          zoomEnabled={true}
          minZoomLevel={0}
          maxZoomLevel={100}>
          <Marker
            coordinate={{
              latitude: parseFloat(dataresult?.capital_latitude),
              longitude: parseFloat(dataresult?.capital_longitude),
              latitudeDelta: 0.2,
              longitudeDelta: 0.05,
            }}
          />
        </MapView>
        <View style={{margin: 20, top: 200}}>
          <Text
            style={{
              color: '#1E1F4B',
              fontFamily: fonts.Bold,
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 8,
            }}>
            {dataresult?.number}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Location:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult?.country}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Network:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult?.network ? dataresult?.network : 'Unknown'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Type:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult?.type ? dataresult.type : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 25,
          alignItems: 'center',
          top: 200,
        }}>
        <TouchableOpacity onPress={() => takeAction('Call')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <DailIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Call
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takeAction('Message')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MessageIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Message
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>handleContacts()}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CreateIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Create
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takeAction('WhatsApp')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <WhatsAppIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              WhatsApp
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NumberDetailScreen;

const styles = StyleSheet.create({});
