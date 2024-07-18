import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import countries from '../data/countries.json';
import {useDispatch, useSelector} from 'react-redux';
import LeftArrow from '../assets/svgs/LeftArrow.svg';
import {setCountry} from '../store/actions/CountryAction';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from '../constants/font';
import {useNavigation} from '@react-navigation/native';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import {AuthRoutes} from '../constants/routes';
import {RFValue} from 'react-native-responsive-fontsize';

const AreaCode = () => {
  const navigation = useNavigation();
  const {country} = useSelector(state => state.countryReducer);
  const [selectedCountry, setSelectedCountry] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setinittialRoute('areacode'));
  // }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCountryPress = item => {
    setSelectedCountry(item);
    toggleModal();
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const filteredCountries = countries.filter(
      country =>
        country.name.toLowerCase().includes(text.toLowerCase()) ||
        country.code.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCountries(filteredCountries);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#000'}
        placeholder="Search Country"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <View>
      <FlatList
      data={filteredCountries}
      showsVerticalScrollIndicator={true}
      bounces={false}
      contentContainerStyle={styles.flatListContent}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Result Found</Text>
        </View>
      )}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // Assuming `dispatch` and `setCountry` are defined
            // handleCountryPress is also defined
            dispatch(setCountry(item));
            handleCountryPress(item);
          }}
          style={styles.cardView}>
          <Image
            style={styles.image}
            source={{
              uri: `https://zoobiapps.com/country_flags/${item.code.toLowerCase()}.png`,
            }}
          />
          <View style={styles.detailsContainer}>
            <Text>{item.name}</Text>
            <Text>+{item.callingCode}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Image
            style={{height: 50, width: 80, marginBottom: 10,resizeMode:'center',}}
            source={{
              uri: `https://zoobiapps.com/country_flags/${selectedCountry?.code.toLowerCase()}.png`,
            }}
          />
        <View style={{margin:8}}>
        <Text style={{color: '#1E1F4B'}}>
            Country Name
            <Text
              style={{
                fontFamily: fonts.Bold,
                fontSize: RFValue(18),
                fontWeight: '700',
              }}>
              :{selectedCountry?.name}
            </Text>
          </Text>
        </View>
          <View style={{margin:8}}>
          <Text style={{color: '#1E1F4B'}}>
            Country Code
            <Text
              style={{
                fontFamily: fonts.Bold,
                fontSize: RFValue(18),
                fontWeight: '700',
              }}>
              :{selectedCountry?.code}
            </Text>
          </Text>
          </View>
         <View style={{margin:8}}>
         <Text style={{color: '#1E1F4B'}}>
            Calling Code
            <Text
              style={{
                fontFamily: fonts.Bold,
                fontSize: RFValue(18),
                fontWeight: '700',
              }}>
              :{selectedCountry?.callingCode}
            </Text>
          </Text>
         </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AreaCode;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'black',
  },
  cardView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingVertical: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    width: wp(95),
    height: 50,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginBottom: 4,

  },
  modalContent: {
    margin: 20,
    width: wp(80),
    height: hp(30),
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems:'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, // To make this view take remaining space
  },
  image: {
    height: 20,
    width: 30,
    marginRight: 20,
  },
  
});
