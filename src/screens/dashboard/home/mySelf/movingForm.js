import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Switch from '../../../../components/switch';
import Button from '../../../../components/button';
import MapModal from '../../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseIcon from '../../../../components/closeIcon';

const MovingForm = (props) => {
  const [mapVisible, setMapVisible] = useState(false);
  const [data, setData] = useState({});
  const handleState = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={false}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.inputForm}>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          fontSize: wp(4),
          color: Colors.inputTextColor,
          textAlign: 'center',
        }}>
        MOVING TO
      </Text>
      <View style={{marginTop: hp(3)}}>
        <TextInput
          label={'To City'}
          // isRight={error.firstName}
          placeHolder={'To City'}
          // onFocus={() => setMapVisible(true)}
          onChange={(text) => setMapVisible(true)}
        />
        <TextInput
          label={'Address Line 1'}
          // isRight={error.firstName}
          placeHolder={'Address Line 1'}
          onChange={(text) => handleState('firstName', text)}
        />
        <TextInput
          label={'Address Line 2'}
          // isRight={error.firstName}
          placeHolder={'Address Line 2'}
          onChange={(text) => handleState('firstName', text)}
        />
        <TextInput
          label={'Pincode'}
          // isRight={error.firstName}
          placeHolder={'Pincode'}
          onChange={(text) => handleState('firstName', text)}
        />
        <View
          style={{
            width: Platform.OS === 'android' ? wp(56) : wp(52),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            label={'Floor'}
            value={data.floor?.toString()}
            placeHolder={'Floor'}
            onChange={(text) => handleState('firstName', text)}
          />
          <Pressable
            style={styles.arrowView}
            onPress={() => {
              handleState('floor', parseInt(data.floor) + 1 || 0);
            }}>
            <MaterialIcons
              name="arrow-drop-up"
              size={35}
              color={Colors.btnBG}
            />
          </Pressable>
          <Pressable
            style={{
              ...styles.arrowView,
              marginLeft: wp(2),
            }}
            onPress={() => {
              if (parseInt(data.floor) - 1 >= 0) {
                handleState('floor', parseInt(data.floor) - 1 || 0);
              }
            }}>
            <MaterialIcons
              name="arrow-drop-down"
              size={35}
              color={Colors.btnBG}
            />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: wp(3),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: wp(52),
            }}>
            <Ionicons name={'information-circle'} size={25} color={'#99A0A5'} />
            <Text
              style={{
                color: '#99A0A5',
                fontFamily: 'Roboto-Regular',
                fontSize: wp(4),
                marginLeft: 5,
              }}>
              Interested in shared services?
            </Text>
          </View>
          <Switch />
        </View>
        <View style={{marginHorizontal: wp(3)}}>
          <Button
            label={'NEXT'}
            onPress={() => {
              if (props.bookingFor === 'Others') {
                props.onPageChange(2);
              } else {
                props.onPageChange(1);
              }
            }}
            width={wp(80)}
          />
        </View>
        <MapModal visible={mapVisible}>
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            style={styles.mapView}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
              }}
            />
          </MapView>
          <CloseIcon
            onPress={() => setMapVisible(false)}
            style={[
              boxShadow,
              {
                position: 'absolute',
                right: 15,
                top: 15,
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: Colors.white,
                ...styles.common,
              },
            ]}
          />
          <View style={{marginTop: hp(3), width: wp(95)}}>
            <TextInput
              label={'Location'}
              smallLabel={'(Drag the map to move the pointer)'}
              // isRight={error.firstName}
              placeHolder={'Location'}
              onChange={(text) => handleState('firstName', text)}
            />
          </View>
          <Pressable
            style={{
              height: hp(7),
              backgroundColor: Colors.btnBG,
              width: wp(100),
              ...styles.common,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.white,
                fontSize: wp(5),
              }}>
              OKAY
            </Text>
          </Pressable>
        </MapModal>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MovingForm;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
  },
  arrowView: {
    height: hp(6.5),
    width: hp(6.5),
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.btnBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: hp(60),
    width: wp(100),
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
