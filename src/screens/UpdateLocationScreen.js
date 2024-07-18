import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Button,
  FlatList,
  Alert,
} from 'react-native';
import LeftArrowIcon from '../assets/svgs/leftarrowIcon.svg';
import fonts from '../constants/font';
import {useDispatch, useSelector} from 'react-redux';
import {updateLocationAlert} from '../store/actions/locationAlertAction';
import LeftArrow from '../assets/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import {useToast} from 'react-native-toast-notifications';
import MapLayer from '../assets/svgs/MapLayer.svg';
import FullScreen from '../assets/svgs/fullscreen.svg';
import Slider from '@react-native-community/slider';
import Geolocation from 'react-native-geolocation-service';
import {setLocation} from '../store/actions/userAction';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {Marker, Circle} from 'react-native-maps';
import LocationPin from '../assets/svgs/Locationpin.svg';
import PlusIcon from '../assets/svgs/PlusIcon.svg';
import MinusIcon from '../assets/svgs/MinusIcon.svg';
import CurrentLocation from '../assets/svgs/currentLocationIcon.svg';
import notifee from '@notifee/react-native';
import moment from 'moment';
import {RFValue} from 'react-native-responsive-fontsize';
const UpdateLocationScreen = ({route}) => {
  const {item, index} = route.params;
  const toast = useToast();
  const {location} = useSelector(state => state.userReducer);
  console.log('Location ALERTS', location);
  console.log(item, 'item');
  console.log(index, 'index');
  const dispatch = useDispatch();
  const [isEnabledInsideSwitch, setIsEnabledInsideSwitch] = useState(item.is_notify_on_arrival);
 const [isEnabledOutsideSwitch, setIsEnabledOutsideSwitch] = useState(item.is_notify_on_exit);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [title, setTitle] = useState('Rawalpindi');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedRadius, setEditedRadius] = useState(item.radius);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editIndex, seteditIndex] = useState(null);
  const [locationAlert, setLocationAlert] = useState({
    id: '',
    name: item.name,
    radius: item.radius,
    is_notification: item.is_notification,
    is_in_radius: false,
    arrival_time: null,
    exit_time: null,
    is_notify_on_arrival: item.is_notify_on_arrival,
    is_notify_on_exit: item.is_notify_on_exit,
    active: true,
    unit: 'M',
  });
  const [markerLocation, setMarkerLocation] = useState({
    latitude: item.coords.latitude,
    longitude: item.coords.longitude,
  });
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const handleUpdate = () => {
    if (locationAlert.name.trim() !== '') {
      dispatch(
        updateLocationAlert({
          index: index,
          item: {
            ...locationAlert,
            coords: markerLocation,
            radius: locationAlert.radius,
            name:editedName,
            timestamp: moment().unix(),
          },
        }),
      )
        .then(data => {
          Alert.alert(
            'Station Update',
            'Your Station is updated successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );
        })
        .catch(err => {});
    } else {
      alert('Please enter a place name');
    }
  };
  async function onDisplayNotification() {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: `Location  tracking ${locationAlert.name}`,
      body: `you reach in radius    ${
        locationAlert.radius > 1000
          ? parseFloat(locationAlert.radius / 1000).toFixed(2)
          : locationAlert.radius
      },
      ${locationAlert.radius > 1000 ? 'Km' : 'm'} , will recieve an alaram`,
      title: `Location tracking ${locationAlert.name}`,
      body: `You are ${
        locationAlert.is_notify_on_arrival ? 'moving inside' : 'moving outside'
      } the specified radius.`,
      android: {
        channelId,
        actions: [
          {
            title: 'Stop',
            pressAction: {
              id: 'stop',
            },
          },
        ],
        asForegroundService: false,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  // Update state when switches are toggled
const handleInsideSwitchToggle = newValue => {
  setIsEnabledInsideSwitch(newValue);
  setLocationAlert(prevState => ({
    ...prevState,
    is_notify_on_arrival: newValue,
  }));
};

const handleOutsideSwitchToggle = newValue => {
  setIsEnabledOutsideSwitch(newValue);
  setLocationAlert(prevState => ({
    ...prevState,
    is_notify_on_exit: newValue,
  }));
};

  // const toggleSwitchinside = () => {
  //   const newValue = !isEnabledinside;
  //   setIsEnabledinside(newValue);
  //   setLocationAlert(prevState => ({
  //     ...prevState,
  //     is_notify_on_arrival: newValue,
  //   }));
  // };
  
  // const toggleSwitchoutside = () => {
  //   const newValue = !isEnabledoutside;
  //   setIsEnabledoutside(newValue);
  //   setLocationAlert(prevState => ({
  //     ...prevState,
  //     is_notify_on_exit: newValue,
  //   }));
  // };
  
  // const [markerCoordinate, setMarkerCoordinate] = useState({
  //   latitude: currentLocation.latitude,
  //   longitude: currentLocation.longitude,
  // });
  const handleLayer = () => {
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
          });
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          dispatch(setLocation(position));
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    };
    getLocation();
  }, []);
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
    const currentMap = mapViewRef.current;
    if (currentMap) {
      currentMap.getCamera().then(cam => {
        cam.zoom += 1;
        currentMap.animateCamera(cam);
      });
    }
  };
  const onZoomoutPress = () => {
    const currentMap = mapViewRef.current;
    if (currentMap) {
      currentMap.getCamera().then(cam => {
        cam.zoom -= 1;
        currentMap.animateCamera(cam);
      });
    }
  };

  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const handleSliderChange = value => {
    console.log('VALUES SLIDER CHANGE', value);
    setEditedRadius(value);
    setLocationAlert(prevState => ({
      ...prevState,
      radius: value,
    }));
  };
  const handleMapPress = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarkerLocation({latitude, longitude});
  };

  const _animateMapToRegion = Location => {
    const {latitude, longitude} = Location;
    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(newRegion, 1000);
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            ref={mapViewRef}
            style={styles.map}
            mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
            onPress={handleMapPress}
            initialRegion={{
              latitude: markerLocation.latitude,
              longitude: markerLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            zoomEnabled={true}
            provider={'google'}
            radius={locationAlert.radius}
            showsMyLocationButton={false}
            showsUserLocation={true}
            moveOnMarkerPress={false}
            showsCompass={true}>
            <Marker coordinate={markerLocation}>
              <LocationPin width={40} height={40} />
            </Marker>
            <Circle
              center={markerLocation}
              strokeColor={'green'}
              strokeWidth={2}
              fillColor={'rgba(112, 193, 103,.4)'}
              radius={editedRadius}
            />
          </MapView>
        </View>

        <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
          top: hp(10),
          right: 30,
        }}>
       <TouchableOpacity onPress={onZoomInPress} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
              // marginTop:60,
              // // top: hp('53%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <PlusIcon width={40} height={40} style={styles.PlusIcon}  />
            </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={onZoomoutPress} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
              // marginTop:60,
              top: hp('7%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <MinusIcon width={40} height={40} style={styles.MinusIcon} />
            </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={handleLayer} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
             top: hp('14%'),
             backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <MapLayer width={40} height={40} style={styles.maplayer} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            mapViewRef.current.animateToRegion({
              latitude:currentLocation.latitude,
              longitude:currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })
          }} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
             top: hp('21%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <CurrentLocation width={40} height={40} style={styles.CurrentLocation} />
            </View>
          </TouchableOpacity>
      
      </View>
        <View style={styles.sheetContainer}>
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Enter location name"
          />
          <Text style={{color: '#3972FE', marginLeft: 23}}>Area</Text>
          <Slider
            style={{
              width: '90%',
              height: 30,
              margin: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            minimumValue={0}
            maximumValue={1000}
            minimumTrackTintColor="#3972FE"
            maximumTrackTintColor="#3972FE"
            thumbTintColor="#3972FE"
            thumbStyle={{width: 20, height: 20}}
            value={editedRadius}
            onValueChange={handleSliderChange}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}>
            <Text style={{color: '#3972FE', margin: 10}}>Moving outside</Text>
            <Switch
              trackColor={{false: '#767577', true: 'green'}}
              thumbColor={isEnabledOutsideSwitch ? '#E8F5E9' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              value={isEnabledOutsideSwitch}
              onValueChange={handleOutsideSwitchToggle}
              style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}>
            <Text style={{color: '#3972FE', margin: 10}}>Moving inside</Text>
            <Switch
              trackColor={{false: '#767577', true: 'green'}}
              thumbColor={isEnabledInsideSwitch ? '#E8F5E9' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              value={isEnabledInsideSwitch}
              onValueChange={handleInsideSwitchToggle}
              style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#3972FE',
              width: '90%',
              height: 50,
              borderRadius: 10,
              alignSelf: 'center',
            }}
            onPress={() => handleUpdate(item, index)}>
            <Text
              style={{
                color: '#fff',
                fontFamily: fonts.Bold,
                fontWeight: '500',
                textAlign: 'center',
                fontSize: RFValue(14),
                marginTop: 15,
              }}>
              Update Place
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default UpdateLocationScreen;

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
  input: {
    width: '90%',
    borderRadius: 10,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingLeft: 12,
    backgroundColor: '#f9f9f9',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('43%'),
    borderRadius: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
