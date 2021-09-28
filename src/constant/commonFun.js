import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Snackbar from 'react-native-snackbar';
import {Colors} from './colors';
import {
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {STYLES} from './commonStyle';
import React from 'react';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

export const resetNavigator = (props, screenName) => {
  props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: screenName}],
    }),
  );
};

export const CustomConsole = (msg) => {
  if (__DEV__) {
    console.log(msg);
  }
};

export const LoadingScreen = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1111,
        ...STYLES.common,
      }}>
      <ActivityIndicator size="large" color={Colors.btnBG} />
    </View>
  );
};

export const secondsToHms = (d) => {
  let m = d % 60;
  let h = (d - m) / 60;
  return h.toString() + ':' + (m < 10 ? '0' : '') + m.toString();
};

export const DiffMin = (dt1) => {
  let dif = moment(dt1) - moment();
  dif = Math.round(dif / 1000);
  return dif > 0 ? dif : 0;
};

export const CustomAlert = (msg = '') => {
  setTimeout(() => {
    Snackbar.dismiss();
  }, 10000);
  return Snackbar.show({
    text: msg,
    duration: Snackbar.LENGTH_INDEFINITE,
    action: {
      text: 'CLOSE',
      textColor: Colors.btnBG,
      onPress: () => {
        Snackbar.dismiss();
      },
    },
  });
  // return Toast.show(msg, Toast.LONG);
};

export const ArrayUnique = (array) => {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }
  return a;
};

export const pad_with_zeroes = (number, length) => {
  let my_string = '' + number;
  while (my_string.length < length) {
    my_string = '0' + my_string;
  }
  return my_string;
};

export const ImageSelection = (type, multiple = false) => {
  let obj = {
    width: 400,
    height: 400,
    cropping: true,
    includeBase64: true,
    multiple: multiple,
    cropperToolbarWidgetColor: Colors.btnBG,
    cropperActiveWidgetColor: Colors.btnBG,
  };
  return new Promise((resolve, reject) => {
    if (type === 'camera') {
      ImagePicker.openCamera(obj)
        .then((response) => {
          resolve('data:image/jpeg;base64,' + response.data);
          reject(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ImagePicker.openPicker(obj)
        .then((response) => {
          let temp = [];
          if (multiple) {
            response.forEach((item) => {
              temp.push('data:image/jpeg;base64,' + item?.data);
            });
            resolve(temp);
          } else {
            resolve('data:image/jpeg;base64,' + response.data);
          }
          reject(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

export const locationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        Alert.alert(
          'Location Permission',
          "Allow Biddnest to access this device's location?",
          [
            {
              text: 'Cancel',
              onPress: () => locationPermission(),
              style: 'cancel',
            },
            {
              text: 'Go To Setting',
              onPress: () =>
                openSettings()
                  .then((res) => {
                    setTimeout(() => {
                      locationPermission();
                    }, 5000);
                  })
                  .catch(() => console.warn('cannot open settings')),
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              CustomConsole(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              CustomConsole(
                'The permission has not been requested / is denied but requestable',
              );
              break;
            case RESULTS.LIMITED:
              CustomConsole(
                'The permission is limited: some actions are possible',
              );
              break;
            case RESULTS.GRANTED:
              CustomConsole('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              CustomConsole(
                'The permission is denied and not requestable anymore',
              );
              break;
          }
        })
        .catch((error) => {
          CustomAlert(error);
        });
    }
  } catch (err) {
    CustomAlert(err);
  }
};

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => reject(error.message),
        {
          // enableHighAccuracy: false,
          timeout: 20000,
          // maximumAge: 1000,
        },
      );
    } catch (e) {
      CustomAlert(e);
    }
  });
};
