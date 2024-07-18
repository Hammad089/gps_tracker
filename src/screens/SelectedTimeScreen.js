import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import AddIcon from '../assets/svgs/AddIcon.svg';
import LeftArrow from '../assets/svgs/LeftArrow.svg';
import fonts from '../constants/font';
const SelectedTimeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(setinittialRoute('selectedtimescreen'));
  // }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', gap: 10, margin: 14}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrow width={20} height={20} style={styles.LeftArrow} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          World{' '}
          <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
            Clock
          </Text>
        </Text>
      </View>
      {/* Time select container */}
      <View style={styles.timeSelectContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 15,
          }}>
          <View>
            <Text
              style={{
                color: '#1E1F4B',
                textAlign: 'center',
                fontFamily: fonts.Bold,
                fontWeight: '700',
              }}>
              New York, USA
            </Text>
            <Text style={{color: '#1E1F4B', textAlign: 'center'}}>
              +3 HRS Current Time
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: '#3972FE',
                textAlign: 'center',
                fontSize: 22,
                fontFamily: fonts.Bold,
                fontWeight: '700',
              }}>
              9:20<Text style={{fontSize: 8, color: '#1E1F4B'}}>PM</Text>
            </Text>
          </View>
          <View>
            <AddIcon width={30} height={30} />
          </View>
        </View>
        <View style={styles.timeSelectContainer1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#1E1F4B',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                New York, USA
              </Text>
              <Text style={{color: '#1E1F4B', textAlign: 'center'}}>
                +3 HRS Current Time
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#3972FE',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                9:20<Text style={{fontSize: 8, color: '#1E1F4B'}}>PM</Text>
              </Text>
            </View>
            <View>
              <AddIcon width={30} height={30} />
            </View>
          </View>
        </View>
        <View style={styles.timeSelectContainer1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#1E1F4B',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                New York, USA
              </Text>
              <Text style={{color: '#1E1F4B', textAlign: 'center'}}>
                +3 HRS Current Time
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#3972FE',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                9:20<Text style={{fontSize: 8, color: '#1E1F4B'}}>PM</Text>
              </Text>
            </View>
            <View>
              <AddIcon width={30} height={30} />
            </View>
          </View>
        </View>
        <View style={styles.timeSelectContainer1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#1E1F4B',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                New York, USA
              </Text>
              <Text style={{color: '#1E1F4B', textAlign: 'center'}}>
                +3 HRS Current Time
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#3972FE',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                9:20<Text style={{fontSize: 8, color: '#1E1F4B'}}>PM</Text>
              </Text>
            </View>
            <View>
              <AddIcon width={30} height={30} />
            </View>
          </View>
        </View>
        <View style={styles.timeSelectContainer1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#1E1F4B',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                New York, USA
              </Text>
              <Text style={{color: '#1E1F4B', textAlign: 'center'}}>
                +3 HRS Current Time
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#3972FE',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                }}>
                9:20<Text style={{fontSize: 8, color: '#1E1F4B'}}>PM</Text>
              </Text>
            </View>
            <View>
              <AddIcon width={30} height={30} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectedTimeScreen;

const styles = StyleSheet.create({
  LeftArrow: {
    ...Platform.select({
      android: {
        marginTop: 2,
      },
    }),
  },
  timeSelectContainer: {
    margin: 15,
    backgroundColor: '#F9F9F9',
    width: wp('90%'),
    height: hp('8%'),
    borderRadius: 10,
  },
  timeSelectContainer1: {
    marginTop: 14,
    backgroundColor: '#F9F9F9',
    width: wp('90%'),
    height: hp('8%'),
    borderRadius: 10,
  },
});
