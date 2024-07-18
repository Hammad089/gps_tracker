import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Button,
  ImageBackground,
  TextInput,
  Platform,
  TouchableNativeFeedback,
  ActivityIndicator
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapIcon from '../assets/svgs/Map.png';
import LeftArrowIcon from '../assets/svgs/leftarrowIcon.svg';
import HistoryIcon from '../assets/svgs/HistoryIcon.svg';
import HistoryIcon2 from '../assets/svgs/HistoryIcon2.svg';
import MapLayer from '../assets/svgs/MapLayer.svg';
import FullScreen from '../assets/svgs/fullscreen.svg';
import fonts from '../constants/font';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import NavigationIcon from '../assets/svgs/navigation.svg';
import PlusIcon from '../assets/svgs/PlusIcon.svg';
import MinusIcon from '../assets/svgs/MinusIcon.svg';
import CurrentLocation from '../assets/svgs/currentLocationIcon.svg';
import ShareIcon from '../assets/svgs/Share1.svg';
import CopyIcon from '../assets/svgs/Copy1.svg';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import LocationPin from '../assets/svgs/Locationpin.svg';
const GPSCordinateScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [responseReceived, setResponseReceived] = useState(false);
  const {location} = useSelector(state => state.userReducer);
  // useEffect(() => {
  //   dispatch(setinittialRoute('gpscordinatescreen'));
  // }, []);

  const MapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: location.coords.latitude ? location.coords.latitude : 0,
    longitude: location.coords.longitude ? location.coords.longitude : 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [markerLocation, setMarkerLocation] = useState(null);
  const [title, setTitle] = useState('Rawalpindi');
  const initialLatitude = currentLocation.latitude.toString();
  const initialLongitude = currentLocation.longitude.toString();
  const [inputLatitude, setInputLatitude] = useState(initialLatitude);
  const [inputLongitude, setInputLongitude] = useState(initialLongitude);
  const [coordinatesEdited, setCoordinatesEdited] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const handleTrafficLayer = () => {
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
    }
  };
  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setMarkerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false); 
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setResponseReceived(true)
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
      console.log('RESPONSE RECEIVED GPSCORDINATE',responseReceived)
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
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom += 1;
        currentMap.animateCamera(cam);
      });
    }
  };
  const onZoomoutPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom -= 1;
        currentMap.animateCamera(cam);
      });
    }
  };


  const handleGetLocation = () => {
    const latitude = parseFloat(inputLatitude);
    const longitude = parseFloat(inputLongitude);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setMarkerLocation({latitude, longitude});
      setCurrentLocation({latitude, longitude});
      getAddress({lat: latitude, lng: longitude});
       _animateMapToRegion({
      latitude:latitude,
      longitude:longitude
    })
    } else {
      console.error('Invalid latitude or longitude');
    }
  };
  const handleMarkerPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setInputLatitude(latitude.toString()); 
    setInputLongitude(longitude.toString());
    setCoordinatesEdited(true);
    getAddress({ lat: latitude, lng: longitude }); 
    _animateMapToRegion({ latitude, longitude });
  };
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude }); 
    setInputLatitude(latitude.toString()); 
    setInputLongitude(longitude.toString()); 
    getAddress({ lat: latitude, lng: longitude }); 
    _animateMapToRegion({ latitude, longitude });
  };
  const _animateMapToRegion = (Location) => {
    const { latitude, longitude } = Location;
    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    setInputLatitude(latitude.toString());
    setInputLongitude(longitude.toString());
    if (MapRef.current) {
      MapRef.current.animateToRegion(newRegion, 1000);
    }
  };
  const addressLines = title.split(',');
  const firstLine = addressLines.slice(0, 5).join(',');
  return (
    <>
      <View style={{flex:1}}>
        {
          loading ? (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#3972FE" />
              <Text style={{textAlign:'center',color:'#3972FE',fontSize:14,fontFamily:fonts.Bold}}>Loading for Map.......</Text>
            </View>
          ):(
            <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            ref={MapRef}
            provider={'google'}
            style={styles.map}
            zoomEnabled={true}
            mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
            onPress={handleMapPress}
            
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.015 * zoomLevel,
              longitudeDelta: 0.0121 * zoomLevel,
            }}
           >
           {markerLocation && (
        <Marker coordinate={markerLocation} onPress={handleMarkerPress}>
        <LocationPin width={40} height={40} />
      </Marker>
      )}
          </MapView>
          <View style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
              top: hp(30),
              right: 30,
            }}>
            
          </View>
        </View>
      
        {/* Location pin icon */}
        {/* <View style={{position:'absolute',alignSelf:'center',top:hp(40),gap:10}}>
              <LocationPin />
          </View> */}
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
       <TouchableOpacity onPress={onZoomInPress} >
            <View
             style={{
              justifyContent:"center",alignItems:"center",
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
              <PlusIcon width={40} height={40} style={styles.PlusIcon}  />
            </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={onZoomoutPress} >
            <View
            style={{
              justifyContent:"center",alignItems:"center",
              marginTop:10,
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
        <TouchableOpacity onPress={handleTrafficLayer} >
            <View
             style={{
              marginTop:10,
              justifyContent:"center",alignItems:"center",
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
          <TouchableOpacity onPress={()=>{
            MapRef.current.animateToRegion({
              latitude:currentLocation.latitude,
              longitude:currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })
          }} >
            <View
             style={{
              marginTop:10,
              justifyContent:"center",alignItems:"center",
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
              <CurrentLocation width={40} height={40} style={styles.CurrentLocation} />
            </View>
          </TouchableOpacity>
      </View>
        <View style={styles.BottomContainer}>
          <View>
            <Text style={{textAlign: 'center', marginTop: 10}}>{firstLine}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 15,
              columnGap: 10,
              marginTop: 20,
            }}>
            <View
              style={{
                width: '50%',
                height: 60,
                borderRadius: 12,
              }}>
              <TextInput
              placeholderTextColor={'#000'}
                style={styles.input}
                placeholder="Enter latitude"
                onChangeText={text => {
                  setInputLatitude(text);
                  setCoordinatesEdited(true);
                }}
                value={inputLatitude}
                keyboardType="numeric"
              />
            </View>
            <View
              style={{
                width: '50%',
                height: 60,
                borderRadius: 12,
              }}>
              <TextInput
                style={styles.input}
                placeholderTextColor={'#000'}
                placeholder="Enter longitude"
                onChangeText={text => {
                  setInputLongitude(text);
                  setCoordinatesEdited(true);
                }}
                value={inputLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>
          {coordinatesEdited && (
            <TouchableOpacity
              onPress={handleGetLocation}
              style={{
                backgroundColor: '#3972FE',
                width: '90%',
                height: 50,
                borderRadius: 5,
                marginLeft: 18,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 10,
              }}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '500',
                }}>
                Get Location
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
          )
        }
      </View>
    </>
  );
};

export default GPSCordinateScreen;

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
  BottomContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    borderRadius: 15,
    width: wp('100%'),
    height: hp('25%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.24,
    shadowRadius: 10,
  },
  TextContainer: {
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: '#F9F9F9',
    width: wp('100%'),
    height: hp('30%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
  },
  NavigationIcon: {
    alignSelf: 'center',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#F9F9F9',
    width: wp('30%'),
    height: hp('7%'),
    borderRadius: 8,
  },
  buttonText: {
    color: '#1E1F4B',
    fontSize: 8,
    fontWeight: '700',
    justifyContent: 'center',
  },
  HideContainer: {
    backgroundColor: '#fff',
    width: wp('90%'),
    height: hp('50%'),
    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
    },
  },
  cordinatesContainer: {
    backgroundColor: 'red',
    width: '50%',
    height: 60,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  input: {
    color:'#000',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
  },
  CurrentLocation:{
    justifyContent:'center',
      alignItems:'center',
      marginLeft:2,
      bottom:2
  },
  PlusIcon:{
    justifyContent:'center',
      alignItems:'center',
      
  },
  MinusIcon:{
    justifyContent:'center',
      alignItems:'center',
      marginLeft:2,
      marginTop:2
  },
  maplayer:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
    marginTop:2
},
overlay:{
  ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
}
});
