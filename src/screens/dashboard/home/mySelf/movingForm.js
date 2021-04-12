import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform} from 'react-native';
import {
  Colors,
  hp,
  wp,
  boxShadow,
  MapConstantDelta,
} from '../../../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Switch from '../../../../components/switch';
import Button from '../../../../components/button';
import MapModalAndroid from '../../../../components/mapModal';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseIcon from '../../../../components/closeIcon';
import FlatButton from '../../../../components/flatButton';
import {CustomAlert, getLocation} from '../../../../constant/commonFun';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

const MovingForm = (props) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googlePlaceRef = useRef(null);
  const [isMapReady, setMapReady] = useState(false);
  const {data, handleStateChange} = props;
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPanding, setPanding] = useState(false);
  const [error, setError] = useState({
    address_line1: undefined,
    address_line2: undefined,
    pincode: undefined,
    floor: undefined,
    city: undefined,
    geocode: undefined,
  });
  const [mapData, setMapData] = useState({
    latitude: 21.1702,
    longitude: 72.8311,
    city: '',
    state: '',
    geocode: '',
    pincode: '',
    address_line1: '',
    address_line2: '',
  });
  const [region, setRegion] = useState({
    latitude: 10.780889,
    longitude: 106.629271,
    latitudeDelta: MapConstantDelta,
    longitudeDelta: MapConstantDelta,
  });
  const scrollViewRef = useRef(null);
  const [address, setAddress] = useState('');
  let source = data?.source || {};
  let destination = data?.destination || {};
  let movingFromData = props.movingFrom ? destination?.meta : source?.meta;

  useEffect(() => {
    getLocation()
      .then((res) => {
        fetchLocationString(res);
      })
      .catch((err) => {
        CustomAlert(err);
      });
  }, [mapVisible]);

  const fetchLocationString = (regionData) => {
    let t1 = {...mapData};
    mapRef?.current?.animateToRegion({
      latitude: regionData?.latitude,
      longitude: regionData?.longitude,
      latitudeDelta: MapConstantDelta,
      longitudeDelta: MapConstantDelta,
    });
    setRegion({
      latitude: regionData?.latitude,
      longitude: regionData?.longitude,
      latitudeDelta: MapConstantDelta,
      longitudeDelta: MapConstantDelta,
    });
    setPanding(false);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${regionData.latitude},${regionData.longitude}&key=AIzaSyCvVaeoUidYMQ8cdIJ_cEvrZNJeBeMpC-4`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let temp = JSON.parse(JSON.stringify(responseJson));
        if (temp?.results && temp?.results?.length > 0) {
          googlePlaceRef?.current?.setAddressText(
            temp?.results[0]?.formatted_address,
          );
          setAddress(temp?.results[0]?.formatted_address);
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
            t1.geocode = temp?.results[0]?.formatted_address;
          });
        }
      });
    t1.latitude = regionData?.latitude;
    t1.longitude = regionData?.longitude;
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

  const onPanDrag = () => {
    if (isPanding) {
      return;
    }
    setPanding(true);
  };

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, [mapRef, setMapReady]);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      enableOnAndroid={false}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.inputForm}>
      <Text
        style={{
          fontFamily: 'Gilroy-Bold',
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
            label={'From'}
            isRight={error?.geocode}
            value={
              props.movingFrom
                ? destination?.meta?.geocode
                : source?.meta?.geocode
            }
            placeHolder={'Choose on map'}
          />
        </Pressable>
        {/*<TextInput*/}
        {/*  label={'Address'}*/}
        {/*  isRight={error.address}*/}
        {/*  placeHolder={'Select building or nearest landmark'}*/}
        {/*  numberOfLines={4}*/}
        {/*  value={*/}
        {/*    props.movingFrom*/}
        {/*      ? destination?.meta?.address*/}
        {/*      : source?.meta?.address*/}
        {/*  }*/}
        {/*  onChange={(text) => handleState('address', text)}*/}
        {/*/>*/}
        <TextInput
          label={'Address Line 1'}
          isRight={error.address_line1}
          placeHolder={'Flat no, Street no'}
          value={
            props.movingFrom
              ? destination?.meta?.address_line1
              : source?.meta?.address_line1
          }
          onChange={(text) => handleState('address_line1', text)}
        />
        <TextInput
          label={'Address Line 2'}
          isRight={error.address_line2}
          placeHolder={'Landmark, Area'}
          value={
            props.movingFrom
              ? destination?.meta?.address_line2
              : source?.meta?.address_line2
          }
          onChange={(text) => handleState('address_line2', text)}
        />
        <TextInput
          label={'City'}
          isRight={error.city}
          value={
            props.movingFrom ? destination?.meta?.city : source?.meta?.city
          }
          placeHolder={'Choose on map'}
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
                ? destination?.meta?.floor.toString()
                : source?.meta?.floor.toString()
            }
            keyboard={'decimal-pad'}
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
              handleState(
                'floor',
                parseInt(
                  props.movingFrom
                    ? destination?.meta?.floor
                    : source?.meta?.floor,
                ) - 1 || 0,
              );
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
                color:
                  movingFromData?.lift === true || movingFromData?.lift == 1
                    ? Colors.textLabelColor
                    : '#99A0A5',
                fontFamily: 'Roboto-Bold',
                fontSize: wp(4),
                marginLeft: 5,
              }}>
              Is lift available?
            </Text>
          </View>
          <Switch
            onChange={(text) => handleState('lift', text)}
            value={
              props.movingFrom ? destination?.meta?.lift : source?.meta?.lift
            }
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: wp(3),
            marginTop: hp(2),
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
                color:
                  movingFromData?.shared_service === true ||
                  movingFromData?.shared_service == 1
                    ? Colors.textLabelColor
                    : '#99A0A5',
                fontFamily: 'Roboto-Bold',
                fontSize: wp(4),
                marginLeft: 5,
              }}>
              Interested in shared services?
            </Text>
          </View>
          <Switch
            onChange={(text) => handleState('shared_service', text === 1)}
            value={
              props.movingFrom
                ? destination?.meta?.shared_service || false
                : source?.meta?.shared_service || false
            }
          />
        </View>
        <View style={{marginHorizontal: wp(3)}}>
          <Button
            label={'NEXT'}
            isLoading={isLoading}
            onPress={() => {
              setLoading(true);
              scrollViewRef?.current?.scrollToPosition(0, 0, true);
              let tempError = {};
              let pageData = props.movingFrom
                ? destination?.meta
                : source?.meta;
              tempError.city = !(!pageData.city || pageData.city.length === 0);
              tempError.geocode = !(
                !pageData.geocode || pageData.geocode.length === 0
              );
              tempError.address_line1 = !(
                !pageData.address_line1 || pageData.address_line1.length === 0
              );
              tempError.address_line2 = !(
                !pageData.address_line2 || pageData.address_line2.length === 0
              );
              tempError.pincode = !(
                !pageData.pincode ||
                pageData?.pincode?.length !== 6 ||
                !/^[0-9]+$/.test(pageData?.pincode)
              );
              tempError.floor = !(pageData?.floor?.toString()?.length === 0);
              setError(tempError);
              if (
                Object.values(tempError).findIndex((item) => item === false) ===
                -1
              ) {
                setError({
                  address_line1: undefined,
                  address_line2: undefined,
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
                  address_line1: '',
                  address_line2: '',
                });
                setLoading(false);
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
              ref={mapRef}
              rotateEnabled={false}
              onMapReady={handleMapReady}
              showsUserLocation
              showsMyLocationButton
              // onRegionChangeComplete={fetchLocationString}
              zoomControlEnabled={false}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              onPress={(event) => {
                fetchLocationString({
                  latitude: event?.nativeEvent?.coordinate?.latitude,
                  longitude: event?.nativeEvent?.coordinate?.longitude,
                });
              }}
              style={
                isMapReady ? {flex: 1, marginBottom: 0} : {marginBottom: 1}
              }
              initialRegion={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: MapConstantDelta,
                longitudeDelta: MapConstantDelta,
              }}>
              <Marker
                ref={markerRef}
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>
            {/*<View*/}
            {/*  style={[styles.markerFixed, isPanding ? styles.isPanding : null]}*/}
            {/*  pointerEvents="none">*/}
            {/*  <Image*/}
            {/*    style={styles.marker}*/}
            {/*    resizeMode="contain"*/}
            {/*    source={require('../../../../assets/images/map_marker.png')}*/}
            {/*  />*/}
            {/*</View>*/}
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
                zIndex: 5000,
                backgroundColor: Colors.white,
                ...styles.common,
              },
            ]}
          />
          <View style={{marginTop: hp(3), width: wp(90)}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.textLabelColor,
                fontSize: wp(4),
              }}>
              Location
              {'  '}
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: Colors.textLabelColor,
                  fontSize: wp(3),
                }}>
                (Choose on map or Search Landmark below)
              </Text>
            </Text>
            <GooglePlacesAutocomplete
              ref={googlePlaceRef}
              placeholder="Search"
              onPress={(data1, details = null) => {
                fetchLocationString({
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                });
              }}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              currentLocation={true}
              currentLocationLabel={'Current location'}
              query={{
                key: 'AIzaSyCvVaeoUidYMQ8cdIJ_cEvrZNJeBeMpC-4',
                language: 'en',
              }}
              styles={{
                textInputContainer: {
                  borderWidth: 2,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  height: hp(6.5),
                  marginTop: hp(1),
                  borderColor: Colors.silver,
                  backgroundColor: Colors.white,
                  borderBottomWidth: 2,
                },
                textInput: {
                  fontSize: wp(4),
                  backgroundColor: Colors.textBG,
                  color: Colors.inputTextColor,
                  height: '99%',
                  textAlignVertical: 'center',
                  fontFamily: 'Gilroy-SemiBold',
                },
              }}
            />
            {/*<TextInput*/}
            {/*  label={'Location'}*/}
            {/*  value={address}*/}
            {/*  smallLabel={'(Drag the map to move the pointer)'}*/}
            {/*  placeHolder={'Location'}*/}
            {/*  onChange={(text) => setAddress(text)}*/}
            {/*/>*/}
          </View>
          <View style={{marginTop: hp(2)}}>
            <FlatButton
              label={'OKAY'}
              onPress={() => {
                if (props.movingFrom) {
                  let temp = {...destination};
                  temp.meta.address_line1 = mapData.address_line1;
                  temp.meta.address_line2 = mapData.address_line2;
                  temp.meta.city = mapData.city;
                  temp.meta.pincode = mapData.pincode;
                  temp.meta.state = mapData.state;
                  temp.meta.geocode = mapData.geocode;
                  temp.lat = mapData.latitude;
                  temp.lng = mapData.longitude;
                  handleStateChange('destination', temp);
                } else {
                  let temp = {...source};
                  temp.meta.address_line1 = mapData.address_line1;
                  temp.meta.address_line2 = mapData.address_line2;
                  temp.meta.city = mapData.city;
                  temp.meta.pincode = mapData.pincode;
                  temp.meta.state = mapData.state;
                  temp.meta.geocode = mapData.geocode;
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
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    height: 48,
    width: 48,
  },
  isPanding: {
    marginTop: -60,
  },
  marker: {
    height: 30,
    width: 30,
  },
});
