import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import MapLayer from '../assets/svgs/MapLayer.svg';
import PauseIcon from '../assets/svgs/Pause.svg';
import HistoryIcon from '../assets/svgs/history.svg';
import LeftArrowIcon from '../assets/svgs/leftarrowIcon.svg';
import fonts from '../constants/font';
import {AuthRoutes} from '../constants/routes';
//import checkPermission from '../logic/checkPermisson';
import {useCountdown} from '../logic/countdown';
import getDistance from '../logic/getDistance';
import {addNewTrack} from '../store/actions/trackAction';
import LocationPin from '../assets/svgs/Locationpin.svg';
import {RFValue} from 'react-native-responsive-fontsize';
import {useToast} from 'react-native-toast-notifications';
import CardSvg from '../assets/svgs/cd.svg';
const initialState = {
  id: '1',
  name: '',
  date: '',
  time: '',
  start_address: '',
  end_address: '',
  distance: '0',
  duration: '0',
  avg_speed: '0',
  max_speed: '0',
  min_speed: '0',
  coordinates: [],
};
const GpsTrackerScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [isStarted, setIsStarted] = useState(false);
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const [location_route, setLocationRoute] = useState([]);
  const mapViewRef = useRef(null);
  const {location} = useSelector(state => state.userReducer);
  //console.log('location',location)
  const {track} = useSelector(state => state.trackReducer);
  const [paused, setPaused] = useState(false);
  const [watchid, setWatchId] = useState(null);
  const [start, setStart] = useState(false);
  const [time_count, setCountDown] = useCountdown({start: start});
  const [track_record, setTrackRecord] = useState(initialState);
  const [saving_track, setSavingTrack] = useState(false);
  const [all_data_saved, setAlData_Saved] = useState(false);
  const [location_permission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  //const [showtraffic, setShowTraffic] = useState(false);
  const [visibleButton, setShowVisiblebutton] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [Loading,setLoading] = useState(true)
  useEffect(() => {
    if (track_record.name !== '') {
      setTrackRecord(prev => ({
        ...prev,
        duration: time_count,
      }));
    }
  }, [time_count]);

  useEffect(() => {
    if (all_data_saved && track_record.name !== '') {
      SaveTrackRecord().then(data => {
        Geolocation.clearWatch(watchid);
        setLocationRoute([]);
        setTrackRecord(initialState);
        setSavingTrack(false);
        setStart(false);
        setCountDown(0);
        setAlData_Saved(false);
      });
    }
  }, [track_record]);

  // const togglePaused = (isPused) => {
  //   try {
  //     if (isPused) {
  //       Geolocation.clearWatch(watchid);
  //     }else{
  //       watchUserPosition()
  //     }
  //     setPaused((isPused) => !isPused);
  //   } catch (error) {
  //     Alert.alert('WatchPosition Error', JSON.stringify(error));
  //   }
  // };

  ////END TRACKING
  const EndTracking = () => {
    toast.hideAll();
    toast.show('Your Tracking is Saved', {
      type: 'success',
      placement: 'top',
      duration: 4000,
      offset: 1,
      animationType: 'zoom-in',
    });
    setSavingTrack(true);

    LocationfromCoords(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      false,
    ).then(data => {});
  };

  const SaveTrackRecord = () => {
    return new Promise((resolve, reject) => {
      dispatch(addNewTrack(track_record));
      resolve();
    });
  };

  const watchUserPosition = () => {
    try {
      const watchID = Geolocation.watchPosition(
        position => {
          let coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          let temp = location_route;
          temp.push(coords);
          setLocationRoute(temp);
          setCurrentLocation(position);
          calculate_distance({
            too: position.coords,
            speed: position.coords.speed * 3.60934,
          });
        },
        error => {},
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: false,
          timeout: 150000,
          maximumAge: 1000,
          distanceFilter: 10,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
      setWatchId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };
  const toggleTracking = () => {
    console.log('PAUSE TRACKING', watchid);

    try {
      const watchID = Geolocation.watchPosition(
        position => {
          if (!paused) {
            let coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            let temp = location_route;
            temp.push(coords);
            setPaused(false);
          } else {
            setModalVisible(!isModalVisible);
          }
        },
        error => {},
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: false,
          timeout: 150000,
          maximumAge: 1000,
          distanceFilter: 10,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
      console.log('WATCH ID', watchID);
      setWatchId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const StartTracking = () => {
    setStart(true);

    setTrackRecord({
      ...track_record,
      name: `Track ${track.length + 1}`,
      date: moment().format('DD-MMM-YYYY'),
      time: moment().format('hh:mm'),
    });
    watchUserPosition();
    LocationfromCoords(
      location.coords.latitude,
      location.coords.longitude,
      true,
    ).then(data => {});
  };
  const calculate_distance = ({too, speed}) => {
    getDistance({
      from: {lat: location.coords.latitude, lng: location.coords.longitude},
      to: {lat: too.latitude, lng: too.longitude},
    }).then(distance => {
      setTrackRecord(prev => ({
        ...prev,
        distance: parseFloat(distance).toFixed(2),
        max_speed: parseInt(speed),
        avg_speed: (parseInt(prev.avg_speed) + parseInt(speed)) / 2,
        duration: time_count,
      }));
    });
  };

  const LocationfromCoords = (lat, long, is_start) => {
    console.log('LATITUDE', lat, 'LONGITUDE', long);
    return new Promise((resolve, reject) => {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&zoom=18&addressdetails=1&accept-language=en`;
      fetch(url, {method: 'GET'})
        .then(data => data.json())
        .then(data => {
          if (!data.error) {
            if (is_start) {
              setTrackRecord(prev => ({
                ...prev,
                start_address: data.display_name,
                duration: time_count,
              }));
            } else {
              setTrackRecord(prev => ({
                ...prev,
                end_address: data.display_name,
                coordinates: location_route,
                duration: time_count,
              }));
              setAlData_Saved(true);
            }
          } else {
            if (is_start) {
              setTrackRecord(prev => ({
                ...prev,
                start_address: 'Adress was not found',
                duration: time_count,
              }));
            } else {
              setTrackRecord(prev => ({
                ...prev,
                end_address: 'Adress was not found',
                duration: time_count,
                coordinates: location_route,
              }));
              setAlData_Saved(true);
            }
          }
          resolve();
        })
        .catch(err => {
          if (is_start) {
            setTrackRecord(prev => ({
              ...prev,
              start_address: 'Adress was not found',
              duration: time_count,
            }));
          } else {
            setTrackRecord(prev => ({
              ...prev,
              end_address: 'Adress was not found',
              coordinates: location_route,
              duration: time_count,
            }));
            setAlData_Saved(true);
          }
        });
    });
  };

  // Map Layer
  const handleLayer = () => {
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
      console.log();
    }
  };

  ///Visible Button
  const handlevisibleButton = () => {
    setShowVisiblebutton(!visibleButton);
    if (!isStarted) {
      StartTracking();
      setIsStarted(true);
    } else {
      EndTracking();
      setIsStarted(false);
    }
  };

  ///toggle Modal
  const toggleModal = () => {
    if (paused) {
      setModalVisible(false);
      setPaused(true);
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={mapViewRef}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.2,
              longitudeDelta: 0.05,
            }}
            zoomEnabled={true}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.2,
              longitudeDelta: 0.05,
            }}
            mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}>
            <Polyline
              coordinates={[...location_route]}
              strokeColor="#0090FF"
              strokeWidth={10}
            />
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}>
              <LocationPin
                width={40}
                height={40}
                title={track_record.start_address}
              />
            </Marker>
          </MapView>
        </View>
        <View
          style={{
            marginRight: 10,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
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
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.history)}>
              <HistoryIcon width={25} height={25} style={styles.history} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleLayer()}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginTop: 200,
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
        </View>
      </View>
      <View style={styles.BottomContainer}>
        <CardSvg width={wp(100) - 20} height={hp(10)} style={styles.CardSvg} />
        <TouchableOpacity
          onPress={() => handlevisibleButton()}
          style={{
            position: 'absolute',
            margin: 10,
            alignSelf: 'flex-end',
            backgroundColor: '#3972FE',
            width: wp(30),
            height: hp(7),
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: RFValue(24),
              fontWeight: 'bold',
              fontFamily: fonts.Bold,
            }}>
            {isStarted ? 'Stop' : 'Start'}
          </Text>
          <Text
              style={{
                position:'absolute',
                fontFamily: fonts.Medium,
                right:wp(35),
                fontSize: 12,
                fontWeight: '500',
                color: '#1E1F4B',
                width: wp(64) - 36,
                paddingLeft: 5,
                margin: 5,
              }}
              ellipsizeMode={'tail'}
              numberOfLines={2}>
              {track_record.name != ''
                ? track_record.start_address
                : 'Please Start The Tracker'}
            </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            position: 'absolute',
            bottom: wp(20),
          }}>
          {visibleButton && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
                paddingHorizontal: 10,
              }}>
              <View style={styles.button}>
                <Text
                  style={{
                    margin: 10,
                    fontSize: RFValue(12),
                    color: '#1E1F4B',
                  }}>
                  Avg Speed
                </Text>
                <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
                  {/* <AvgSpeedIcon width={10} height={20} /> */}
                  <Text
                    style={{
                      color: '#1E1F4B',
                      fontSize: RFValue(14),
                      fontWeight: '700',
                    }}>
                    {track_record.avg_speed}km/hr
                  </Text>
                </View>
              </View>
              <View style={styles.button}>
                <Text
                  style={{
                    margin: 10,
                    fontSize: RFValue(12),
                    color: '#1E1F4B',
                  }}>
                  Max Speed
                </Text>
                <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
                  <Text
                    style={{
                      color: '#1E1F4B',
                      fontSize: RFValue(14),
                      fontWeight: '700',
                    }}>
                    {track_record.max_speed}km/hr
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleTracking()}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Platform.select({
                      ios: {
                        marginTop: 28,
                      },
                      android: {
                        marginTop: 20,
                      },
                    }),
                  }}>
                  <PauseIcon width={20} height={20} />
                  <Text style={{fontSize: RFValue(15), color: '#1E1F4B'}}>
                    Pause
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{flex: 1, backgroundColor: '#0000'}}>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/images/CarLocaton.png')}
            resizeMethod={'resize'}
            resizeMode={'center'}
            style={{
              width: wp('60%'),
              justifyContent: 'center',
              alignItems: 'center',
              height: hp('25%'),
            }}
          />
          <Text
            style={{
              color: '#3972FE',
              fontSize: RFValue(22),
              fontWeight: '700',
              textAlign: 'center',
            }}>
            GPS{' '}
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: RFValue(22),
                fontWeight: '700',
              }}>
              Tracker
            </Text>
          </Text>
          <Text style={{textAlign: 'center'}}>
            {track_record.start_address}
          </Text>
          <View
            style={{
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => StartTracking()}
              style={{
                backgroundColor: paused ? '#F24C5C' : '#F9F9F9',
                width: wp('30%'),
                height: hp('4%'),
                borderRadius: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: paused ? '#fff' : '#000',
                  alignItems: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                {paused ? 'Continue' : 'Pause'}
              </Text>
            </TouchableOpacity>
          </View>
          {start ? (
            <View style={{...styles.Row, height: 45}}>
              <TouchableOpacity
                onPress={() => EndTracking()}
                style={{
                  backgroundColor: '#F24C5C',
                  width: wp('30%'),
                  height: hp('4%'),
                  borderRadius: 10,
                  marginTop: 14,
                }}>
                {saving_track ? (
                  <ActivityIndicator color={'green'} size={'small'} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...Platform.select({
                        ios: {
                          marginTop: 10,
                        },
                        android: {
                          marginTop: 5,
                        },
                      }),
                      fontFamily: fonts.SemiBold,
                      fontWeight: '700',
                    }}>
                    Stop
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              disabled={saving_track}
              onPress={() => {
                if (!location_permission) {
                  StartTracking();
                } else {
                  setLocationPermission(false);
                }
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000',
                  alignItems: 'center',
                  marginTop: 10,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                {location_permission
                  ? 'Not Avaliable Without Location '
                  : 'Start Tracking'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </>
  );
};

export default GpsTrackerScreen;

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
    width: wp(100) - 20,
    alignSelf: 'center',
  },
  TextContainer: {
    margin: 10,
    justifyContent: 'center',
    marginTop: 14,
    borderRadius: 7,
    ///backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#F9F9F9',
    width: wp('30%'),
    height: hp('9%'),
    borderRadius: 8,
    marginBottom: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#1E1F4B',
    fontSize: 8,
    fontWeight: '700',
    justifyContent: 'center',
  },
  HideContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp(90),
    height: hp(10),
    shadowColor: 'black',
    borderRadius: 8,
    shadowOffset: {
      width: 0,
    },
  },
  history: {
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maplayer: {
    marginTop: -2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Loading: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    justifyContent: 'center',
    alignItems: 'center',
  },
  CardSvg: {
    borderRadius: 10,
  },
});
