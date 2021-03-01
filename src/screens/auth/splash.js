import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {resetNavigator} from '../../constant/commonFun';
import {Colors, hp, wp} from '../../constant/colors';

const Splash = (props) => {
  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    OneSignal.init('6b33862a-ec91-44bd-bf29-1c8ae35317d1', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
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
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }
  function onIds(device) {
    console.log('Device info: ', device);
  }
  useEffect(() => {
    setTimeout(() => {
      resetNavigator(props, 'Login');
    }, 1500);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{height: hp(50), width: wp(80)}}
        resizeMode={'contain'}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.silver,
  },
});
