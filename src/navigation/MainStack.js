import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import AddNewLocation from '../BottomTabScreen/AddNewLocation';
import NavigateLocation from '../BottomTabScreen/NavigateLocation';
import SearchLocation from '../BottomTabScreen/SearchLocation';
import AdPlacescreen from '../screens/AdPlacescreen';
import AddnewLocationScreen from '../screens/AddnewLocationScreen';
import AlltitudeMeterScreen from '../screens/AlltitudeMeterScreen';
import AreaCode from '../screens/AreaCode';
import Compass from '../screens/Compass';
import FindAddressScreen from '../screens/FindAddressScreen';
import GPSCordinateScreen from '../screens/GPSCordinateScreen';
import GpsTrackerHistory from '../screens/GpsTrackerHistory';
import GpsTrackerScreen from '../screens/GpsTrackerScreen';
import IPAndMacAddress from '../screens/IPAndMacAddress';
import LanguageScreen from '../screens/LanguageScreen2';
import MainScreen from '../screens/MainScreen';
import NumberDetailScreen from '../screens/NumberDetailScreen';
import SelectedTimeScreen from '../screens/SelectedTimeScreen';
import StationAlert from '../screens/StationAlert';
import UpdateLocationScreen from '../screens/UpdateLocationScreen';
import WorldClock from '../screens/WorldClock';
import DrawerContent from './DrawerContent';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const MainStack = ({navigation, route}) => {
  const initialRouteName = useSelector(
    state => state.initailRouteReducer.initialRouteName,
  );
  //console.log(initialRouteName);
  <StatusBar barStyle="dark-content" backgroundColor="#6a51ae" />;
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: '800',
          color: '#0000',
        },
        headerTintColor: '#000',
        headerBackTitleStyle: {
          fontSize: 10,
        },
      }}>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
      />
      <Stack.Screen
        name="AddNewLocation"
        component={AddNewLocation}
        options={{
          title: 'Saved Location',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="GpsTracker"
        component={GpsTrackerScreen}
        options={{
          title: 'GPS Tracker',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="history"
        component={GpsTrackerHistory}
        options={{
          title: 'Track History',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="alltitudemeter"
        component={AlltitudeMeterScreen}
        options={{
          title: 'Altitude Meter',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="numberdetail"
        component={NumberDetailScreen}
        options={{
          title: 'Number Detail',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="ipmacaddress"
        component={IPAndMacAddress}
        options={{
          title: 'IP Address',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="worldclock"
        component={WorldClock}
        options={{
          title: 'World Clock',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="selectedtimescreen" component={SelectedTimeScreen} />
      <Stack.Screen
        name="findaddress"
        component={FindAddressScreen}
        options={{
          title: 'Find Address',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          title: 'Language',
          headerShown: true,
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="gpscordinatescreen"
        component={GPSCordinateScreen}
        options={{
          title: 'GPS Coordinate',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="stationalert"
        component={StationAlert}
        options={{
          title: 'Location List',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="adplacescreen"
        component={AdPlacescreen}
        options={{
          title: 'Add Station',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="addnewlocationscreen"
        component={AddnewLocationScreen}
      />
      <Stack.Screen
        name="compass"
        component={Compass}
        options={{
          title: 'Compass',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      {/* <Stack.Screen
        name="savedlocation"
        component={SavedLocation}
        options={{
          title: 'Saved Location',
          color: '#3972FE',
          fontWeight: 'bold',
        }}
      /> */}
      <Stack.Screen
        name="searchlocation"
        component={SearchLocation}
        options={{
          title: 'Search Location',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="areacode"
        component={AreaCode}
        options={{
          title: 'Area Code',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="update"
        component={UpdateLocationScreen}
        options={{
          title: 'Edit Location',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="navigate"
        component={NavigateLocation}
        options={{
          title: 'Navigate Location',
          headerTitleStyle: {
            color: '#3972FE',
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const MainStackDrawer = () => (
  <Drawer.Navigator
    initialRouteName="MainStack"
    swipeEnabled={false}
    gestureEnabled={false}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: wp(100),
      },
    }}
    drawerContent={props => {
      return <DrawerContent {...props} />;
    }}>
    <Drawer.Screen name="MainStack">
      {props => <MainStack {...props} />}
    </Drawer.Screen>
  </Drawer.Navigator>
);
export default MainStackDrawer;
