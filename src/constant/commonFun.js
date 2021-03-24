import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {IMAGE_OPTIONS} from './colors';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

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

export const secondsToHms = (d) => {
  let m = d % 60;
  let h = (d - m) / 60;
  return h.toString() + ':' + (m < 10 ? '0' : '') + m.toString();
};

export const DiffMin = (dt1) => {
  let dif = dt1 - new Date();
  dif = Math.round(dif / 1000 / 60);
  return dif;
};

export const CustomAlert = (msg = '') => {
  return Toast.show(msg, Toast.LONG);
};

export const pad_with_zeroes = (number, length) => {
  let my_string = '' + number;
  while (my_string.length < length) {
    my_string = '0' + my_string;
  }
  return my_string;
};

export const ImageSelection = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(IMAGE_OPTIONS, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        resolve('data:image/jpeg;base64,' + response.data);
      }
      reject(false);
    });
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
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
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
  });
};
