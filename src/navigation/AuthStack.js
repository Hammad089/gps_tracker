import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import fonts from '../constants/font';
import LanguageScreen from '../screens/LanguageScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
const Stack = createNativeStackNavigator();
function AuthStack() {
  const {selectedLanguage} = useSelector(state =>state.languageReducer)
  ///console.log('SELECTED LANGUAGE in AUTH STACK',selectedLanguage)
  const initialRouteName = useSelector(state => state.initailRouteReducer.initialRouteName);
  ///console.log(initialRouteName);
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: '#3972FE',
          fontSize: 16,
          fontWeight: '700',
          
        },
      }}>
     
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: true,
          title: 'Language',
          headerBackVisible:false,
          headerShadowVisible:false,
          statusBarColor:'white',
          headerTitleStyle:{
            fontSize:20,
            fontWeight:'700',
            fontFamily:fonts.Bold,
            // color: '#3972FE',
          }
        }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          title: selectedLanguage.Privacy_Policy,
          headerTitleStyle:{
            fontSize:24,
            color:'#3972FE'
          },
          headerShadowVisible:false,
        }}
      />
      <Stack.Screen name="onboarding" component={OnboardingScreen}  options={{
          headerShadowVisible:false,
          headerShown:false,
          title:'On boarding'
        }} />
    </Stack.Navigator>
  );
}
export default AuthStack;
