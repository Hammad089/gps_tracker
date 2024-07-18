import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Share,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Modal from 'react-native-modal';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import LocationPin from '../assets/svgs/Locationpin.svg';
import ImageIcon from '../assets/svgs/image-plus.svg';
import RightArrow from '../assets/svgs/rightArrow.svg';
import SearchIcon from '../assets/svgs/searchIcon2.svg';
import fonts from '../constants/font';
import {AuthRoutes} from '../constants/routes';
import {useToast} from 'react-native-toast-notifications';
const SearchLocation = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const {location} = useSelector(state => state.userReducer);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  //const [suggestions, setSuggestions] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const [Note, setNote] = useState('');
  const [locationName, setLocationName] = useState('');
  //const [selectedLayer, setSelectedLayer] = useState('standard');
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [cameraImgUrl, setCameraImgUrl] = useState();
  const [isSearchLocation, setIsSearchLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: location.coords.latitude ? location.coords.latitude : 0,
    longitude: location.coords.longitude ? location.coords.longitude : 0,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const dispatch = useDispatch();
  const refRBSheet = useRef();

  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    const {latitude, longitude} = coordinate;

    setCurrentLocation({latitude, longitude});
    setMapRegion(prevRegion => ({
      ...prevRegion,
      latitude,
      longitude,
    }));

    const address = currentLocation;
    setTitle(address);
    storeLocationData(address, latitude, longitude);
  };
  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setLoading(false);
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.log(error);
          setLoading(false);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    };
    getLocation();
  }, []);
  const handleSearchIconPress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      //  console.log('Search API Response:', data);
      if (data.length > 0) {
        const selectedLocation = data[0];
        const latitude = parseFloat(selectedLocation.lat);
        const longitude = parseFloat(selectedLocation.lon);
        // console.log('Selected Location:', { latitude, longitude });
        _animateMapToRegion({
          latitude: latitude,
          longitude: longitude,
        });
        setCurrentLocation({
          latitude: latitude,
          longitude: longitude,
        });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        getAddress({lat: latitude, lng: longitude});
      }
    } catch (error) {
      console.error('Error fetching and parsing data', error);
    }
  };

  const getAddress = ({lat, lng}) => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1&accept-language=en`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result.display_name);
        setTitle(result.display_name);
      })
      .catch(error => console.error(error));
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      path: 'images/jpeg',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
    await launchImageLibrary(options, response => {
      if (!response.didCancel) {
        console.log(response);
        const imageuri = response.assets[0].uri;
        setImageUrl(imageuri);
        setModalVisible(false);
      } else {
        console.log('Image picker cancelled');
      }
    });
  };
  ////luanch camera
  const handleCamera = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      cameraType: 'back',
      saveToPhotos: true,
    };

    try {
      const cameraPermission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });

      const faceIdPermission = PERMISSIONS.IOS.FACE_ID;
      const permissions = [cameraPermission, faceIdPermission];
      const permissionStatuses = await requestMultiple(permissions);

      if (
        permissionStatuses[cameraPermission] === 'granted' ||
        permissionStatuses[faceIdPermission] === 'granted'
      ) {
        launchCamera(options, response => {
          if (response.didCancel) {
            console.log('Camera picker canceled');
          } else {
            const cameraUrl = response.assets[0].uri;
            setCameraImgUrl(cameraUrl);
            setModalVisible(false);
          }
        });
      } else {
        console.log('Permissions not granted for camera or FaceID');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };
  ////remove photo
  const removePhoto = () => {
    setImageUrl(null);
    setModalVisible(false);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const storeLocationData = async (
    address,
    latitude,
    longitude,
    contactNumber,
    title,
    Note,
  ) => {
    try {
      let locationDataArray = [];
      const existingLocationData = await AsyncStorage.getItem('locationData');
      if (existingLocationData) {
        locationDataArray = JSON.parse(existingLocationData);
      }
      if (!Array.isArray(locationDataArray)) {
        locationDataArray = [];
      }
      locationDataArray.push({
        address,
        latitude,
        longitude,
        contactNumber,
        title,
        Note,
      });
      await AsyncStorage.setItem(
        'locationData',
        JSON.stringify(locationDataArray),
      );
      console.log('location', locationDataArray);
    } catch (error) {
      console.error('Error storing location data:', error);
    }
  };
  useEffect(() => {
    fetchStoredLocation();
  }, [isFocused]);

  const handleSaveLocation = () => {
    if (!locationName) {
      setError('Location name is required');
      return;
    }
    const {latitude, longitude} = mapRegion;
    storeLocationData(
      locationName,
      latitude,
      longitude,
      contactNumber,
      title,
      Note,
    );
    setTitle('');
    setContactNumber('');
    setLocationName('');
    refRBSheet.current.close();
    toast.show('Location saved successfully', {
      type: 'success',
      placement: 'bottom',
      duration: 4000,
      offset: 30,
      animationType: 'slide-in | zoom-in',
    });
    //navigation.navigate(AuthRoutes.addnewlocation)
  };

  const fetchStoredLocation = async () => {
    try {
      const locationData = await AsyncStorage.getItem('locationData');
      if (locationData !== null) {
        const {address} = JSON.parse(locationData);
        setSearchInput(address);
        setSearchInput('');
      }
    } catch (error) {
      console.error('Error fetching stored location:', error);
    }
  };
  const mapref = useRef(null);
  const _animateMapToRegion = location => {
    const {latitude, longitude} = location;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    if (mapref) {
      mapref.current.animateToRegion(newRegion, 1000);
    }
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: ' GPS TrackerApp link',
        message:
          'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=com.gpstracker.number.locationtracker',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const handleInputChange = text => {
    setLocationName(text);
    setError('');
  };
  const handleRbSheet = () => {
    refRBSheet.current.open();
    
  };

  return (
    <>
      <View style={{flex: 1}}>
        {loading ? (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="rgba(0, 0, 0, 0.5)" />
          </View>
        ) : (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.container}>
              <MapView
                ref={mapref}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                zoomEnabled={true}
                onPress={handleMapPress}
                initialRegion={mapRegion}
                //onRegionChange={setMapRegion}
              >
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}>
                  <LocationPin width={40} height={40} />
                </Marker>
              </MapView>
            </View>
            
              <View style={styles.layercontainer}>
                <TextInput
                  placeholder="Search Location"
                  placeholderTextColor={'#0004'}
                  value={searchInput}
                  onChangeText={text => setSearchInput(text)}
                  style={styles.input}
                  onSubmitEditing={handleSearchIconPress}
                  returnKeyType="search"
                />
                <TouchableOpacity onPress={handleSearchIconPress}>
                  <SearchIcon style={styles.SearchIcon} />
                </TouchableOpacity>
              </View>
            
          </View>
        )}

        <View>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: 'transparent',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
              container: {
                height: wp(100),
              },
            }}>
            <ScrollView>
              <View style={{}}>
                <Modal
                  isVisible={isModalVisible}
                  onBackdropPress={() => setModalVisible(!isModalVisible)}
                  style={{flex: 1, backgroundColor: '#0000'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      width: '100%',
                      backgroundColor: '#fff',
                      borderRadius: 20,
                      padding: 20,
                      alignItems: 'center',
                    }}></View>
                </Modal>

                <TextInput
                  placeholder="Enter Location Name"
                  placeholderTextColor={'#0004'}
                  value={locationName}
                  onChangeText={handleInputChange}
                  style={{
                    margin: 10,
                    marginTop: 30,
                    marginBottom: 15,
                    paddingLeft: 10,
                    backgroundColor: '#f9f9f9',
                    width: '95%',
                    height: 45,
                    borderRadius: 10,
                    color: '#1E1F4B',
                  }}
                />
                {error ? (
                  <Text style={{color: 'red', marginLeft: 10, marginTop: -10}}>
                    {error}
                  </Text>
                ) : null}
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 10,
                    marginTop: 35,
                    columnGap: 6,
                    bottom: 25,
                    elevation: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#F5F5F5',
                      width: '50%',
                      height: 50,
                      borderRadius: 12,
                    }}>
                    <Text style={{textAlign: 'center', marginTop: 15}}>
                      {currentLocation.latitude.toFixed(5)}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F5F5F5',
                      width: '50%',
                      height: 50,
                      borderRadius: 12,
                    }}>
                    <Text style={{textAlign: 'center', marginTop: 15}}>
                      {currentLocation.longitude.toFixed(5)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9',
                    width: '95%',
                    height: 60,
                    borderRadius: 12,
                    margin: 5,
                    bottom: 33,
                  }}>
                  <Text
                    style={{textAlign: 'center', marginTop: 10, margin: 10}}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {title}
                  </Text>
                </View>
              </View>
              <View>
                <TextInput
                  placeholder="Contact Number"
                  placeholderTextColor={'#0004'}
                  style={styles.contactInput}
                  value={contactNumber}
                  keyboardType="phone-pad"
                  dataDetectorTypes={'phoneNumber'}
                  onChangeText={text => setContactNumber(text)}
                />
              </View>
              <View>
                <TextInput
                  placeholder="Note"
                  placeholderTextColor={'#0004'}
                  style={styles.NoteInput}
                  value={Note}
                  onChangeText={text => setNote(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                  bottom: 70,
                  margin: 20,
                }}>
                <TouchableOpacity
                  onPress={() => handleSaveLocation()}
                  style={{
                    backgroundColor: '#3972FE',
                    width: '50%',
                    height: 50,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontFamily: fonts.Bold,
                      fontWeight: '700',
                      marginTop: 15,
                    }}>
                    Save Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onShare()}
                  style={{
                    backgroundColor: '#3972FE',
                    width: '50%',
                    height: 50,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontFamily: fonts.Bold,
                      fontWeight: '700',
                      marginTop: 15,
                    }}>
                    Share Location
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </RBSheet>
          <View
            style={{
              backgroundColor: '#fff',
              elevation:10,
              width: wp('95%'),
              height: 60,
              margin: 10,
              borderRadius: 10,
              position: 'absolute',
              bottom: hp(65),
            }}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 10,
                marginTop: 20,
                margin: 15,
              }}>
              <Text
                ellipsizeMode={'tail'}
                style={{fontSize: RFValue(14), fontWeight: '900'}}>
                latitude{currentLocation.latitude.toFixed(5)}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                style={{fontSize: RFValue(14), fontWeight: '900'}}>
                longitude{currentLocation.longitude.toFixed(5)}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                bottom: 32,
                marginRight: 15,
              }}>
              <TouchableOpacity onPress={() => handleRbSheet()}>
                <RightArrow width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* <FlatList
             data={suggestions}
             renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionPress(item)}
              style={styles.suggestionItem}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.place_id}
        /> */}
    </>
  );
};

export default SearchLocation;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // HistoryContainer: {
  //   backgroundColor: '#F9F9F9',
  //   width: wp('100%'),
  //   height: hp('15%'),
  //   borderRadius: 10,
  //   margin: 20,
  // },

  input: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 70,
      },
     
    }),
    paddingLeft: 20,
    backgroundColor: '#fff',
    width: '95%',
    height: 60,
    margin: 10,
    borderRadius: 10,
    color: '#1E1F4B',
    elevation:10
  },
  contactInput: {
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
    width: '95%',
    height: 50,
    margin: 10,
    borderRadius: 10,
    bottom: 40,
    color: '#1E1F4B',
  },
  NoteInput: {
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
    width: '95%',
    height: 50,
    margin: 10,
    borderRadius: 10,
    bottom: 50,
    color: '#1E1F4B',
  },

  SearchIcon: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 80,
      },
    }),
    right: 30,
    alignSelf: 'flex-end',
    alignItems:'center',
    marginTop:30,
    justifyContent: 'center',
  },
  leftArrowIcon: {
    position: 'absolute',
    top: 50,
    left: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
