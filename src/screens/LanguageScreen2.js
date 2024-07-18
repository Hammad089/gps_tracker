import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useToast } from 'react-native-toast-notifications';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { NativeBanner } from '../NativeAds/NativeBannerads copy';
import FranciasCountry from '../assets/images/france.png';
import India from '../assets/images/india.png';
import JapanIcon from '../assets/images/japan.png';
import PakistanIcon from '../assets/images/pakistan.png';
import Portuguese from '../assets/images/pourtgal.png';
import SothKorea from '../assets/images/south_korea.png';
import Espanol from '../assets/images/spain.png';
import English from '../assets/images/usa.png';
import { setSelectLanguage } from '../store/actions/languageAction';
import translationalLanguage from '../store/index';
import NativeAdLanguageAd from '../NativeAds/NativeLanguageAds';
const Languages = [
  {
    icon: English,
    title: 'English',
    id: 'English',
  },
  {
    icon: Espanol,
    title: 'Espanol',
    id: 'Spanish',
  },
  {
    icon: Portuguese,
    title: 'Portuguese',
    id: 'Portuguese',
  },
  {
    icon: India,
    title: 'भारत',
    id: 'Hindi',
  },
  {
    icon: SothKorea,
    title: '대한민국',
    id: 'Korean',
  },
  {
    icon: FranciasCountry,
    title: 'French',
    id: 'French',
  },
  {
    icon: PakistanIcon,
    title: 'اردو',
    id: 'Urdu',
  },
  {
    icon: JapanIcon,
    title: '漢字',
    id: 'Japanese',
  },
  // {
  //     icon:SouthAfricaIcon,
  //     title:'Afrikaans'
  // },
  // {
  //     icon:IndonessiaIcon,
  //     title:'Indonesia'
  // }
];
const LanguageScreen2 = ({}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleSelectLanguage = index => {
    setSelectedLanguage(index);
  };

  const handleConfirmLanguage = () => {
    toast.hideAll();
    if (selectedLanguage === null) {

      toast.show('SELECT LANGUAGE', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        offset: 1,
        animationType: 'zoom-in',
      });
    } else {
      dispatch(
        setSelectLanguage({
          selectedLanguageName: Languages[selectedLanguage].id,
          selectedLanguage:
            translationalLanguage[Languages[selectedLanguage].id],
        }),
      );
      navigation.goBack();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => handleConfirmLanguage()}>
          <AntDesign name={'check'} size={25} color={'black'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedLanguage]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{flex: 1, marginBottom: 250}}>
        <View style={styles.rowContainer}>
          {Languages.map((item, index) => (
            <TouchableOpacity
              onPress={() => handleSelectLanguage(index)}
              style={styles.container}
              key={index}>
              <Image source={item.icon} style={styles.ImageStyle} />
              <Text style={styles.textStyle}>{item.title}</Text>
              <View style={styles.coverIcon}>
                {selectedLanguage === index && (
                  <Icon name="check-circle" size={25} color="#3972FE" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{position:"absolute", bottom:10}} >
      <NativeAdLanguageAd />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    width: wp('100%'),
    columnGap: 8,
    margin: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  container: {
    width: wp(46),
    height: hp(13),
    marginTop: 5,
    backgroundColor: '#F9F9F9',
    padding: 5,
    borderRadius: 10,
  },
  ImageStyle: {
    width: 50,
    height: 40,
    marginTop: 16,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textStyle: {
    textAlign: 'center',
    color: '#060606',
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
  coverIcon: {
    position: 'absolute',
    right: 10,
    marginTop: 10,
  },
});

export default LanguageScreen2;
