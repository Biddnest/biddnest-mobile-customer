import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import {
  CustomAlert,
  locationPermission,
  resetNavigator,
} from '../../constant/commonFun';
import {Colors, hp, wp} from '../../constant/colors';
import {useDispatch, useSelector} from 'react-redux';
import {initialConfig} from '../../redux/actions/user';
import AsyncStorage from '@react-native-community/async-storage';
import {STYLES} from '../../constant/commonStyle';
import {CustomTabs} from 'react-native-custom-tabs';
import {isAndroid} from 'react-native-calendars/src/expandableCalendar/commons';
import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';

const Splash = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const notificationData =
    useSelector(
      (state) => state.Login?.configData?.enums?.notification?.type,
    ) || {};
  const userData = useSelector((state) => state.Login?.loginData?.user);
  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    OneSignal.init('6b33862a-ec91-44bd-bf29-1c8ae35317d1', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    Sentry.init({
      dsn:
        'https://cb2933829efd4941a6ecc455591e7c7a@o939247.ingest.sentry.io/5899802',
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
  }, []);
  function myiOSPromptCallback(permission) {
    // do something with permission value
  }
  function onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  function onOpened(openResult) {
    console.log('Data: ', openResult);
    let temp = openResult?.notification?.payload?.additionalData || {};
    if (temp?.type === notificationData?.booking) {
      if (
        temp?.booking_status === 2 ||
        temp?.booking_status === 3 ||
        temp?.booking_status === 15
      ) {
        props.navigation.navigate('OrderTimer', {
          orderData: {public_booking_id: temp.public_booking_id},
        });
      } else if (temp?.booking_status === 4) {
        props.navigation.navigate('FinalQuote', {
          orderData: {public_booking_id: temp.public_booking_id},
        });
      } else if (
        temp?.booking_status === 5 ||
        temp?.booking_status === 6 ||
        temp?.booking_status === 7 ||
        temp?.booking_status === 8
      ) {
        props.navigation.navigate('OrderTracking', {
          orderData: {public_booking_id: temp.public_booking_id},
        });
      }
    } else if (temp?.type === notificationData?.link) {
      if (isAndroid) {
        CustomTabs.openURL(temp?.url, {
          toolbarColor: Colors.darkBlue,
        })
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      } else {
        Linking.openURL(temp?.url);
      }
    }
  }
  function onIds(device) {
    if (device && device.userId) {
      AsyncStorage.setItem('oneSignalData', JSON.stringify(device));
    }
    console.log('Device info: ', device);
  }
  const callServiceAPI = () => {
    locationPermission();
    dispatch(initialConfig())
      .then((res) => {
        setLoading(false);
        if (res.status === 'success') {
          if (res?.data?.config?.service_live) {
            if (
              res?.data?.config?.app?.version_code <=
              DeviceInfo.getBuildNumber()
            ) {
              if (userData?.fname) {
                resetNavigator(props, 'Dashboard');
              } else {
                resetNavigator(props, 'WalkThroughPage');
              }
            } else {
              Alert.alert(
                'Update Available',
                'App must be updated for use new features',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      Linking.openURL(
                        isAndroid
                          ? 'https://play.google.com/store/apps'
                          : 'https://www.apple.com/in/store',
                      );
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          } else {
            Alert.alert(
              'Please try again later',
              res?.data?.config?.message,
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: false},
            );
          }
        }
      })
      .catch((err) => {
        checkConnectivity();
        setLoading(false);
        err?.data && CustomAlert(err?.data?.message);
      });
  };
  useEffect(() => {
    checkConnectivity();
    callServiceAPI();
  }, []);
  const checkConnectivity = () => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        Alert.alert(
          'Internet Connectivity',
          'Check your internet connectivity',
          [
            {
              text: 'Retry',
              onPress: () => callServiceAPI(),
            },
          ],
          {cancelable: false},
        );
      }
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/yellow_back.png')}
      style={{height: '100%', width: '100%', ...STYLES.common}}
      resizeMode={'stretch'}>
      {!!isLoading && (
        <View style={{position: 'absolute', bottom: hp(20), zIndex: 111}}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        </View>
      )}
      <Image
        source={require('../../assets/images/splash_logo.png')}
        style={{height: hp(50), width: wp(70)}}
        resizeMode={'contain'}
      />
    </ImageBackground>
  );
};

export default Splash;
