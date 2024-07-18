import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LeftArrowIcon from '../assets/svgs/leftarrowIcon.svg';
import MapLayer from '../assets/svgs/MapLayer.svg';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import NavigationIcon from '../assets/svgs/navigation.svg';
import PlusIcon from '../assets/svgs/PlusIcon.svg';
import MinusIcon from '../assets/svgs/MinusIcon.svg';
import CurrentLocation from '../assets/svgs/currentLocationIcon.svg';
import ShareIcon from '../assets/svgs/Share1.svg';
import CopyIcon from '../assets/svgs/Copy1.svg';
import {useDispatch} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Clipboard from '@react-native-clipboard/clipboard';
import LocationPin from '../assets/svgs/Locationpin.svg';
import fonts from '../constants/font';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FindAddressScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const MapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [responseReceived, setResponseReceived] = useState(false);
  // useEffect(() => {
  //   dispatch(setinittialRoute('findaddress'));
  // }, []);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [title, setTitle] = useState('Rawalpindi');

  console.log(title);
  const handleLayer = () => {
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
      console.log();
    }
  };

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          //console.log('GDGDGDGDGDG', position);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setMarkerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setResponseReceived(true);
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
  useEffect(() => {
    if (responseReceived) {
      console.log('RESPONSE RECEIVED in FIND ADDRESS', responseReceived);
      MapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [responseReceived]);

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
        setTitle(result.display_name);
      })
      .catch(error => console.error(error));
  };
  const onZoomInPress = () => {
    MapRef?.current?.getCamera().then(cam => {
      cam.zoom += 1;
      MapRef?.current?.animateCamera(cam);
    });
  };
  const onZoomOutPress = () => {
    console.log('HRAMI');
    MapRef?.current?.getCamera().then(cam => {
      cam.zoom -= 1;
      MapRef?.current?.animateCamera(cam);
    });
  };

  const copyCoordinates = () => {
    const {latitude, longitude} = currentLocation;
    const coordinate = `${latitude}, ${longitude}`;
    console.log(coordinate);

    Clipboard.setString(coordinate);
  };
  const handleMarkerPress = event => {
    console.log('hellof');
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setMarkerLocation({latitude, longitude});
    getAddress({lat: latitude, lng: longitude});
  };
  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setMarkerLocation({latitude, longitude});
    getAddress({lat: latitude, lng: longitude});
  };
  const _animateMapToRegion = Location => {
    const {latitude, longitude} = Location;
    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    if (MapRef.current) {
      MapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const googleMapOpenUrl = ({latitude, longitude}) => {
    const latLng = `${latitude},${longitude}`;
    return `google.navigation:q=${latLng}`;
  };
  const openMaps = () => {
    AsyncStorage.setItem('canShowAppOpenAd', 'false');
    Linking.openURL(
      googleMapOpenUrl({
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      }),
    );
  };
  return (
    <>
      <View style={{flex: 1}}>
        {loading ? (
          <>
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#3972FE" />
              <Text
                style={{
                  textAlign: 'center',
                  color: '#3972FE',
                  fontSize: 14,
                  fontFamily: fonts.Bold,
                }}>
                Loading for Map.......
              </Text>
            </View>
          </>
        ) : (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.container}>
              <MapView
                ref={MapRef}
                provider={'google'}
                style={styles.map}
                zoomEnabled={true}
                mapType={
                  selectedLayer === 'standard' ? 'standard' : 'satellite'
                }
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                onPress={handleMapPress}>
                <Marker coordinate={markerLocation} onPress={handleMarkerPress}>
                  <LocationPin width={40} height={40} />
                </Marker>
              </MapView>
              <View
                style={{position: 'absolute', top: hp('30%'), right: 5}}></View>
            </View>
            {/* icons */}

            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-end',
                top: hp(30),
                right: 15,
              }}>
              <TouchableOpacity onPress={onZoomInPress}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    elevation: 10,
                    ...Platform.select({
                      ios: {
                        width: wp(12),
                        height: hp(5),
                      },
                      android: {
                        width: wp(12),
                        height: hp(5.5),
                      },
                    }),
                    borderRadius: 10,
                  }}>
                  <PlusIcon width={40} height={40} style={styles.PlusIcon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onZoomOutPress()}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    backgroundColor: '#fff',
                    elevation: 10,
                    ...Platform.select({
                      ios: {
                        width: wp(12),
                        height: hp(5),
                      },
                      android: {
                        width: wp(12),
                        height: hp(5.5),
                      },
                    }),
                    borderRadius: 10,
                  }}>
                  <MinusIcon width={40} height={40} style={styles.MinusIcon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLayer()}>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    elevation: 10,
                    ...Platform.select({
                      ios: {
                        width: wp(12),
                        height: hp(5),
                      },
                      android: {
                        width: wp(12),
                        height: hp(5.5),
                      },
                    }),
                    borderRadius: 10,
                  }}>
                  <MapLayer width={40} height={40} style={styles.maplayer} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  MapRef.current.animateToRegion({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    marginTop: 10,
                    elevation: 10,
                    ...Platform.select({
                      ios: {
                        width: wp(12),
                        height: hp(5),
                      },
                      android: {
                        width: wp(12),
                        height: hp(5.5),
                      },
                    }),
                    borderRadius: 10,
                  }}>
                  <CurrentLocation
                    width={40}
                    height={40}
                    style={styles.CurrentLocation}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={copyCoordinates}>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    evation: 10,
                    backgroundColor: '#fff',
                    ...Platform.select({
                      ios: {
                        width: wp(12),
                        height: hp(5),
                      },
                      android: {
                        width: wp(12),
                        height: hp(5.5),
                      },
                    }),
                    borderRadius: 10,
                  }}>
                  <CopyIcon width={40} height={40} style={styles.CopyIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
              <View style={styles.TextContainer}>
                <Text
                  style={{
                    justifyContent: 'center',
                    margin: 10,
                    width: wp(60),
                    paddingLeft: 5,
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={2}>
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => openMaps()}
                style={{
                  backgroundColor: '#3972FE',
                  width: wp('30%'),
                  height: hp('7.3%'),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  top: 15,
                  right: 10,
                }}>
                <NavigationIcon style={styles.NavigationIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default FindAddressScreen;

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
  LeftArrowIcon: {
    position: 'absolute',
  },
  RefreshIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },

  TextContainer: {
    margin: 10,
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: '#F9F9F9',
    width: wp('95%'),
    height: hp('7.3%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
    elevation: 10,
  },
  NavigationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  CurrentLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    bottom: 2,
  },
  PlusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  MinusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  maplayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  CopyIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 2,
  },
  bottom: {
    position: 'absolute',
    bottom: 25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
