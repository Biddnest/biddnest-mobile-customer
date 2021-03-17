import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Switch from '../../../../components/switch';
import Button from '../../../../components/button';
import MapModalAndroid from '../../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseIcon from '../../../../components/closeIcon';
import FlatButton from '../../../../components/flatButton';
import {pad_with_zeroes} from '../../../../constant/commonFun';

const MovingForm = (props) => {
  const {data, handleStateChange} = props;
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    address: undefined,
    pincode: undefined,
    floor: undefined,
    city: undefined,
  });
  let source = data?.source || {};
  let destination = data?.destination || {};

  const handleState = (key, value) => {
    if (props.movingFrom) {
      let temp = {...destination};
      temp.meta[key] = value;
      handleStateChange('destination', temp);
    } else {
      let temp = {...source};
      temp.meta[key] = value;
      handleStateChange('source', temp);
    }
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
        MOVING {props.movingFrom ? 'TO' : 'FROM'}
      </Text>
      <View style={{marginTop: hp(3)}}>
        <Pressable onPress={() => setMapVisible(true)}>
          <TextInput
            disable={true}
            label={props.movingFrom ? 'To City' : 'From City'}
            isRight={error.city}
            placeHolder={'Chennai'}
          />
        </Pressable>
        <TextInput
          label={'Address'}
          isRight={error.address}
          placeHolder={'Select building or nearest landmark'}
          numberOfLines={4}
          value={
            props.movingFrom
              ? destination?.meta?.address
              : source?.meta?.address
          }
          onChange={(text) => handleState('address', text)}
        />
        <TextInput
          label={'Pincode'}
          isRight={error.pincode}
          keyboard={'decimal-pad'}
          value={
            props.movingFrom
              ? destination?.meta?.pincode.toString()
              : source?.meta?.pincode.toString()
          }
          placeHolder={'560097'}
          onChange={(text) => handleState('pincode', text)}
        />
        <View
          style={{
            width: Platform.OS === 'android' ? wp(56) : wp(52),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            label={'Floor'}
            isRight={error.floor}
            value={
              props.movingFrom
                ? pad_with_zeroes(destination?.meta?.floor, 2).toString()
                : pad_with_zeroes(source?.meta?.floor, 2).toString()
            }
            placeHolder={'Floor'}
            onChange={(text) => handleState('floor', text)}
          />
          <Pressable
            style={styles.arrowView}
            onPress={() => {
              handleState(
                'floor',
                parseInt(
                  props.movingFrom
                    ? destination?.meta?.floor
                    : source?.meta?.floor,
                ) + 1 || 0,
              );
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
              if (
                parseInt(
                  props.movingFrom
                    ? destination?.meta?.floor
                    : source?.meta?.floor,
                ) -
                  1 >=
                0
              ) {
                handleState(
                  'floor',
                  parseInt(
                    props.movingFrom
                      ? destination?.meta?.floor
                      : source?.meta?.floor,
                  ) - 1 || 0,
                );
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
              setLoading(true);
              let tempError = {};
              let pageData = props.movingFrom
                ? destination?.meta
                : source?.meta;
              if (!pageData.city || pageData.city.length === 0) {
                tempError.city = false;
              } else {
                tempError.city = true;
              }
              if (!pageData.address || pageData.address.length === 0) {
                tempError.address = false;
              } else {
                tempError.address = true;
              }
              if (
                !pageData.pincode ||
                pageData?.pincode?.length !== 6 ||
                !/^[0-9]+$/.test(pageData?.pincode)
              ) {
                tempError.pincode = false;
              } else {
                tempError.pincode = true;
              }
              if (
                !pageData.floor ||
                pageData.floor.length === 0 ||
                !/^[0-9]+$/.test(pageData?.floor)
              ) {
                tempError.floor = false;
              } else {
                tempError.floor = true;
              }
              setError(tempError);
              if (
                Object.values(tempError).findIndex((item) => item === false) ===
                -1
              ) {
                setError({
                  address: undefined,
                  pincode: undefined,
                  floor: undefined,
                  city: undefined,
                });
                if (props.movingFrom) {
                  if (props.bookingFor === 'Others') {
                    props.onPageChange(2);
                  } else {
                    props.onPageChange(1);
                  }
                } else {
                  props.changeTo();
                }
              } else {
                setLoading(false);
              }
            }}
            width={wp(80)}
          />
        </View>
        <MapModalAndroid
          visible={mapVisible}
          onPress={() => setMapVisible(false)}>
          <View style={styles.mapView}>
            <MapView
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              style={{flex: 1}}
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
          </View>
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
          <View style={{marginTop: hp(2)}}>
            <FlatButton label={'OKAY'} />
          </View>
        </MapModalAndroid>
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
    height: hp(67),
    width: wp(100),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
