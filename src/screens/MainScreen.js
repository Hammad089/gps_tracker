import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CurvedBottomBarExpo} from 'react-native-curved-bottom-bar';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {RFValue} from 'react-native-responsive-fontsize';
import {useSelector} from 'react-redux';
import Config from '../../env';
import GpsTool from '../BottomTabScreen/GpsTool';
import HomeScreen from '../BottomTabScreen/HomeScreen';
import SearchNumber from '../BottomTabScreen/SearchNumber';
import SpeedoMeterScreen from '../BottomTabScreen/SpeedoMeterScreen';
import GpstoolIcon from '../assets/svgs/Gpstool.svg';
import HomeIcon from '../assets/svgs/Home.svg';
import CircleIcon from '../assets/svgs/MainScreenIcon.svg';
import SearchIcon from '../assets/svgs/SearchIcon.svg';
import SpeedoMeterIcon from '../assets/svgs/SpeedoMeter.svg';
import SelectedGPStoolIcon from '../assets/svgs/selectedGPS.svg';
import SelectedHomeIcon from '../assets/svgs/selectedHome.svg';
import SelectedSearchIcon from '../assets/svgs/selectedSearch.svg';
import SelectedSpeedoMeterIcon from '../assets/svgs/selectedSpeedoMeter.svg';
import {AuthRoutes} from '../constants/routes';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function MainScreen() {
  const {AddConfig} = useSelector(state => state.remoteConfigReducer);
  const {isKeyboardOpen} = useSelector(state => state.appStatusReducer);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const [adLoading, setAdLoading] = useState(true);
 // console.log(Config.BannerHome,'HHSH');

  const handleIconClick = () => {
    navigation.navigate(AuthRoutes.addnewlocation);
  };

  const onAdFailedToLoad = error => {
    console.log('ERROR',error);
     setAdLoading(true);
     setError(true)
  };

  const onAdLoaded = (err) => {
    console.log('ERROR',err);
    setAdLoading(false);
    setError(true)
  };

  const _renderIcon = (routeName, selectedTab) => {
    let icon = null;
    let text = '';

    switch (routeName) {
      case 'Home':
        icon =
          routeName === selectedTab ? (
            <SelectedHomeIcon width={25} height={25} />
          ) : (
            <HomeIcon width={25} height={25} />
          );
        text = 'Home';
        break;
      case 'speedo-meter':
        icon =
          routeName === selectedTab ? (
            <SelectedSpeedoMeterIcon width={25} height={25} />
          ) : (
            <SpeedoMeterIcon width={25} height={25} />
          );
        text = 'Speedo';
        break;
      case 'Search Number':
        icon =
          routeName === selectedTab ? (
            <SelectedSearchIcon width={25} height={25} />
          ) : (
            <SearchIcon width={25} height={25} />
          );
        text = 'Search';
        break;
      case 'Gps Tool':
        icon =
          routeName === selectedTab ? (
            <SelectedGPStoolIcon width={25} height={25} />
          ) : (
            <GpstoolIcon width={25} height={25} />
          );
        text = 'GPS Tool';
        break;
    }

    return (
      <View style={styles.tabItemContainer}>
        {icon}
        <Text
          style={{
            ...styles.tabItemText,
            color: routeName === selectedTab ? 'blue' : 'gray',
          }}>
          {text}
        </Text>
      </View>
    );
  };

  const renderTabBar = ({routeName, selectedTab, navigate}) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  const renderCircle = ({selectedTab, navigate}) => (
    <Animated.View style={styles.btnCircleUp}>
      <TouchableOpacity style={styles.button} onPress={handleIconClick}>
        <CircleIcon height={60} width={60} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={55}
        circleWidth={50}
        screenOptions={{headerShown: false}}
        bgColor="white"
        renderCircle={renderCircle}
        tabBar={renderTabBar}>
        <CurvedBottomBarExpo.Screen
          name="Home"
          position="LEFT"
          component={HomeScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="speedo-meter"
          position="LEFT"
          component={SpeedoMeterScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="Search Number"
          component={SearchNumber}
          position="RIGHT"
        />
        <CurvedBottomBarExpo.Screen
          name="Gps Tool"
          component={GpsTool}
          position="RIGHT"
        />
      </CurvedBottomBarExpo.Navigator>

      {!isKeyboardOpen && adLoading ? (
       <ShimmerPlaceholder style={[styles.shimmerContainer,{opacity:adLoading  ? 0:1}]}>
       <BannerAd
         unitId={Config.BannerHome}
         size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
         requestOptions={{requestNonPersonalizedAdsOnly: true}}
         onAdFailedToLoad={onAdFailedToLoad}
         onAdLoaded={onAdLoaded}
         onAdClosed={() => {
           console.log('BANNER AD CLOSED');
         }}
         onAdOpened={() => {}}
       />
       </ShimmerPlaceholder>
      ) : (
       <View style={{
        opacity: adLoading || error ? 1 : 0,
       }}>
         <BannerAd
        unitId={Config.BannerHome}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{requestNonPersonalizedAdsOnly: true}}
        onAdFailedToLoad={onAdFailedToLoad}
        onAdLoaded={onAdLoaded}
        onAdClosed={() => {
          console.log('BANNER AD CLOSED');
        }}
        onAdOpened={() => {}}
        />
       </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {
    backgroundColor: '#fff',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    bottom: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
  tabItemText: {
    fontSize: RFValue(10),
    color: '#3F3F55',
  },
  shimmerContainer: {
    width: '100%',
    alignItems: 'center',
    
  },
  shimmer: {
    height: hp(6),
    width: wp(100),
  },
});
