import React, {useEffect, useState} from 'react';
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
import {
  CustomAlert,
  getLocation,
  pad_with_zeroes,
} from '../../../../constant/commonFun';

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
  const [mapData, setMapData] = useState({
    latitude: 21.1702,
    longitude: 72.8311,
    city: '',
    state: '',
    pincode: '',
    address: '',
  });
  let source = data?.source || {};
  let destination = data?.destination || {};

  useEffect(() => {
    getLocation()
      .then((res) => {
        fetchLocationString(res.latitude, res.longitude);
      })
      .catch((err) => {
        CustomAlert(err);
      });
  }, [mapVisible]);

  const fetchLocationString = (latitude, longitude) => {
    let t1 = {...mapData};
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        'AIzaSyCvVaeoUidYMQ8cdIJ_cEvrZNJeBeMpC-4',
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let temp = JSON.parse(JSON.stringify(responseJson));
        if (temp?.results && temp?.results?.length > 0) {
          temp?.results[0].address_components.forEach((item, index) => {
            if (
              item?.types?.findIndex(
                (ele) => ele === 'administrative_area_level_2',
              ) !== -1
            ) {
              t1.city = item?.long_name;
            } else if (
              item?.types?.findIndex((ele) => ele === 'postal_code') !== -1
            ) {
              t1.pincode = item?.long_name;
            } else if (
              item?.types?.findIndex(
                (ele) => ele === 'administrative_area_level_1',
              ) !== -1
            ) {
              t1.state = item?.long_name;
            }
          });
          t1.address = temp?.results[0]?.formatted_address;
        }
      });
    t1.latitude = latitude;
    t1.longitude = longitude;
    setMapData(t1);
  };

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
            value={
              props.movingFrom ? destination?.meta?.city : source?.meta?.city
            }
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
            isLoading={isLoading}
            onPress={() => {
              setLoading(true);
              let tempError = {};
              let pageData = props.movingFrom
                ? destination?.meta
                : source?.meta;
              tempError.city = !(!pageData.city || pageData.city.length === 0);
              tempError.address = !(
                !pageData.address || pageData.address.length === 0
              );
              tempError.pincode = !(
                !pageData.pincode ||
                pageData?.pincode?.length !== 6 ||
                !/^[0-9]+$/.test(pageData?.pincode)
              );
              tempError.floor = !(
                !pageData.floor ||
                pageData.floor.length === 0 ||
                !/^[0-9]+$/.test(pageData?.floor)
              );
              setError(tempError);
              if (
                Object.values(tempError).findIndex((item) => item === false) ===
                -1
              ) {
                setLoading(false);
                setError({
                  address: undefined,
                  pincode: undefined,
                  floor: undefined,
                  city: undefined,
                });
                setMapData({
                  latitude: 21.1702,
                  longitude: 72.8311,
                  city: '',
                  state: '',
                  pincode: '',
                  address: '',
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
              onPress={(event) => {
                fetchLocationString(
                  event?.nativeEvent?.coordinate?.latitude,
                  event?.nativeEvent?.coordinate?.longitude,
                );
              }}
              style={{flex: 1}}
              initialRegion={{
                latitude: mapData.latitude,
                longitude: mapData.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: mapData.latitude,
                  longitude: mapData.longitude,
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
              value={mapData?.address?.toString()}
              smallLabel={'(Drag the map to move the pointer)'}
              placeHolder={'Location'}
              onChange={(text) => setMapData({...mapData, address: text})}
            />
          </View>
          <View style={{marginTop: hp(2)}}>
            <FlatButton
              label={'OKAY'}
              onPress={() => {
                if (props.movingFrom) {
                  let temp = {...destination};
                  temp.meta.address = mapData.address;
                  temp.meta.city = mapData.city;
                  temp.meta.pincode = mapData.pincode;
                  temp.meta.state = mapData.state;
                  temp.lat = mapData.latitude;
                  temp.lng = mapData.longitude;
                  handleStateChange('destination', temp);
                } else {
                  let temp = {...source};
                  temp.meta.address = mapData.address;
                  temp.meta.city = mapData.city;
                  temp.meta.pincode = mapData.pincode;
                  temp.meta.state = mapData.state;
                  temp.lat = mapData.latitude;
                  temp.lng = mapData.longitude;
                  handleStateChange('source', temp);
                }
                setMapVisible(false);
              }}
            />
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
