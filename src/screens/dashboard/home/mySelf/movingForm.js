import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Keyboard,
} from 'react-native';
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
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseIcon from '../../../../components/closeIcon';
import FlatButton from '../../../../components/flatButton';
import {
  CustomAlert,
  CustomConsole,
  getLocation,
} from '../../../../constant/commonFun';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import InformationPopUp from '../../../../components/informationPopUp';
import {useDispatch, useSelector} from 'react-redux';
import {APICall, getZones} from '../../../../redux/actions/user';
import {getDistance} from 'geolib';
import {STORE} from '../../../../redux';
navigator.geolocation = require('@react-native-community/geolocation');

const MovingForm = (props) => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const googlePlaceRef = useRef(null);
  const [isMapReady, setMapReady] = useState(false);
  const {data, handleStateChange} = props;
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPanding, setPanding] = useState(false);
  const [liftInfo, setLiftInfo] = useState(false);
  const [sharedInfo, setSharedInfo] = useState(false);
  const [error, setError] = useState({
    address_line1: undefined,
    address_line2: undefined,
    pincode: undefined,
    state: undefined,
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
  const zones = useSelector((state) => state.Login?.zones) || [];
  const scrollViewRef = useRef(null);
  const [address, setAddress] = useState('');
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  let source = data?.source || {};
  let destination = data?.destination || {};
  let movingFromData = props.movingFrom ? destination?.meta : source?.meta;
  useEffect(() => {
    dispatch(getZones());
  }, []);

  useEffect(() => {
    if (mapVisible) {
      getLocation()
        .then((res) => {
          fetchLocationString(res);
        })
        .catch((err) => {
          CustomAlert(err);
        });
    }
  }, [mapVisible]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      Keyboard.removeListener('keyboardDidShow');
      Keyboard.removeListener('keyboardDidHide');
    };
  }, []);

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
        console.log(temp);
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
            // else if (
            //   item?.types?.findIndex((ele) => {
            //     if (ele === 'street_number' || ele === 'route') {
            //       return ele;
            //     }
            //   }) !== -1
            // ) {
            //   t1.address_line1 = t1.address_line1 + item?.long_name;
            // } else if (
            //   item?.types?.findIndex((ele) => {
            //     if (
            //       ele === 'sublocality_level_3' ||
            //       ele === 'sublocality_level_2' ||
            //       ele === 'sublocality_level_1'
            //     ) {
            //       return ele;
            //     }
            //   }) !== -1
            // ) {
            //   t1.address_line2 = t1.address_line2 + item?.long_name;
            // }
            t1.geocode = temp?.results[0]?.formatted_address;
          });
        }
      });
    t1.latitude = regionData?.latitude;
    t1.longitude = regionData?.longitude;
    setLoading(false);
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
            label={props.movingFrom ? 'Drop Location' : 'Pickup Location'}
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
          placeHolder={'City'}
          onChange={(text) => handleState('city', text)}
        />
        <TextInput
          label={'State'}
          isRight={error.state}
          value={
            props.movingFrom ? destination?.meta?.state : source?.meta?.state
          }
          placeHolder={'State'}
          onChange={(text) => handleState('state', text)}
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <View
            style={{
              width: Platform.OS === 'android' ? wp(56) : '76%',
            }}>
            <TextInput
              disable={true}
              label={'Floor'}
              isRight={error.floor}
              value={
                props.movingFrom
                  ? destination?.meta?.floor.toString()
                  : source?.meta?.floor.toString()
              }
              maxLength={3}
              keyboard={'decimal-pad'}
              placeHolder={'Floor'}
              onChange={(text) => handleState('floor', text)}
            />
          </View>
          <Pressable
            style={styles.arrowView}
            onPress={() => {
              if (
                props.movingFrom
                  ? destination?.meta?.floor < 150
                  : source?.meta?.floor < 150
              ) {
                handleState(
                  'floor',
                  parseInt(
                    props.movingFrom
                      ? destination?.meta?.floor
                      : source?.meta?.floor,
                  ) + 1 || 0,
                );
              }
            }}>
            <MaterialIcons
              name="arrow-drop-up"
              size={hp(5)}
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
                props.movingFrom
                  ? destination?.meta?.floor > -3
                  : source?.meta?.floor > -3
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
              size={hp(5)}
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
            <Pressable onPress={() => setLiftInfo(true)}>
              <Ionicons
                name={'information-circle'}
                size={hp(3.5)}
                color={'#99A0A5'}
              />
            </Pressable>
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
        {!props.movingFrom && (
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
              <Pressable onPress={() => setSharedInfo(true)}>
                <Ionicons
                  name={'information-circle'}
                  size={hp(3.5)}
                  color={'#99A0A5'}
                />
              </Pressable>
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
        )}
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
              tempError.state = !(
                !pageData.state || pageData.state.length === 0
              );
              tempError.pincode = !(
                !pageData.pincode ||
                pageData?.pincode?.length !== 6 ||
                !/^[0-9]+$/.test(pageData?.pincode)
              );
              tempError.floor = !(
                pageData?.floor?.toString()?.length === 0 ||
                pageData?.floor < -3 ||
                pageData?.floor > 150
              );
              scrollViewRef?.current?.scrollToPosition(0, 0, true);
              setError(tempError);
              if (
                Object.values(tempError).findIndex((item) => item === false) ===
                -1
              ) {
                setError({
                  address_line1: undefined,
                  address_line2: undefined,
                  state: undefined,
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
                scrollViewRef?.current?.scrollToPosition(0, 0, true);
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
              // showsUserLocation
              onRegionChangeComplete={(region) => {
                if (!isKeyboardOpen) {
                  fetchLocationString(region);
                }
              }}
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
                isMapReady
                  ? {flex: 1, marginBottom: 0}
                  : {flex: 1, marginBottom: 1}
              }
              initialRegion={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: MapConstantDelta,
                longitudeDelta: MapConstantDelta,
              }}>
              {/*<Marker*/}
              {/*  coordinate={{*/}
              {/*    latitude: region.latitude,*/}
              {/*    longitude: region.longitude,*/}
              {/*  }}*/}
              {/*/>*/}
              {!props.movingFrom &&
                zones.map((item, index) => {
                  return (
                    <MapView.Circle
                      key={index}
                      center={{
                        latitude: item?.lat,
                        longitude: item?.lng,
                      }}
                      radius={item?.service_radius * 1000}
                      strokeWidth={1}
                      strokeColor={Colors.darkBlue}
                      fillColor={'rgba(230,238,255,0.5)'}
                    />
                  );
                })}
            </MapView>
            <View style={styles.markerFixed}>
              <MaterialIcons
                name={'location-pin'}
                size={hp(5)}
                color={Colors.darkBlue}
              />
            </View>
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
                right: hp(2),
                top: hp(2),
                height: hp(5),
                width: hp(5),
                borderRadius: hp(2.5),
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
              isLoading={isLoading}
              onPress={() => {
                if (props.movingFrom) {
                  setLoading(true);
                  let obj = {
                    url: 'bookings/distance',
                    method: 'post',
                    headers: {
                      Authorization:
                        'Bearer ' + STORE.getState().Login?.loginData?.token,
                    },
                    data: {
                      source: {
                        lat: data?.source?.lat,
                        lng: data?.source?.lng,
                      },
                      destination: {
                        lat: mapData.latitude,
                        lng: mapData.longitude,
                      },
                    },
                  };
                  APICall(obj)
                    .then((res) => {
                      setLoading(false);
                      if (res?.data?.status === 'success') {
                        if (res?.data?.data?.distance !== 0) {
                          let temp = {...destination};
                          temp.meta.address_line1 = mapData.address_line1;
                          // temp.meta.address_line2 = mapData.address_line2;
                          temp.meta.city = mapData.city;
                          temp.meta.pincode = mapData.pincode;
                          temp.meta.state = mapData.state;
                          temp.meta.geocode = mapData.geocode;
                          temp.lat = mapData.latitude;
                          temp.lng = mapData.longitude;
                          handleStateChange('destination', temp);
                          setMapVisible(false);
                        } else {
                          alert(
                            'Currently we are unable to deliver here. Please select a valid destination.',
                          );
                        }
                      } else {
                        CustomAlert(res?.data?.message);
                      }
                    })
                    .catch((err) => {
                      setLoading(false);
                      CustomConsole(err);
                    });
                } else {
                  let count = 0;
                  zones.forEach((item, index) => {
                    let temp = getDistance(
                      {
                        latitude: mapData?.latitude,
                        longitude: mapData?.longitude,
                      },
                      {latitude: item?.lat, longitude: item?.lng},
                    );
                    if (temp <= item?.service_radius * 1000) {
                      count = count + 1;
                    }
                  });

                  if (count > 0) {
                    let temp = {...source};
                    temp.meta.address_line1 = mapData.address_line1;
                    // temp.meta.address_line2 = mapData.address_line2;
                    temp.meta.city = mapData.city;
                    temp.meta.pincode = mapData.pincode;
                    temp.meta.state = mapData.state;
                    temp.meta.geocode = mapData.geocode;
                    temp.lat = mapData.latitude;
                    temp.lng = mapData.longitude;
                    handleStateChange('source', temp);
                    setMapVisible(false);
                  } else {
                    alert(
                      'Your location is not currently serviceable by biddnest. We will be expanding soon.',
                    );
                  }
                }
              }}
            />
          </View>
        </MapModalAndroid>
        <InformationPopUp
          visible={liftInfo || sharedInfo}
          label={
            liftInfo
              ? 'Mentioning this helps us being better prepaid for your moment'
              : 'If checked, our vendors will move your items along with other items in a shared vehicle \n\n Checking this option will effectively reduce the movement cost, else A dedicated vehicle will be used.'
          }
          title={liftInfo ? 'lift' : 'Shared Service'}
          onCloseIcon={() => {
            if (liftInfo) {
              setLiftInfo(false);
            } else {
              setSharedInfo(false);
            }
          }}
        />
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
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    height: hp(5),
    width: hp(5),
  },
  isPanding: {
    marginTop: -60,
  },
  marker: {
    height: 30,
    width: 30,
  },
});
