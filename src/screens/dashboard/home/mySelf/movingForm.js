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
  GoogleMapKey,
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
  Polygon,
} from 'react-native-maps';
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
import {isAndroid} from 'react-native-calendars/src/expandableCalendar/commons';
navigator.geolocation = require('@react-native-community/geolocation');

const MovingForm = (props) => {
  console.log({props});
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const googlePlaceRef = useRef(null);
  const [isMapReady, setMapReady] = useState(false);
  const {data, handleStateChange} = props;
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPanding, setPanding] = useState(false);
  const [liftInfo, setLiftInfo] = useState(false);
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
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 21.1702,
    longitude: 72.8311,
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
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (mapVisible) {
      getCurrentLocation();
    }
  }, [mapVisible]);

  const getCurrentLocation = () => {
    getLocation()
      .then((res) => {
        fetchLocationString(res);
        setCurrentLocation({
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      })
      .catch((err) => {
        CustomAlert(err);
      });
  };

  console.log({mapData});

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
      latitudeDelta: regionData?.latitudeDelta || MapConstantDelta,
      longitudeDelta: regionData?.longitudeDelta || MapConstantDelta,
    });
    setRegion({
      latitude: regionData?.latitude,
      longitude: regionData?.longitude,
      latitudeDelta: regionData?.latitudeDelta || MapConstantDelta,
      longitudeDelta: regionData?.longitudeDelta || MapConstantDelta,
    });
    setPanding(false);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${regionData.latitude},${regionData.longitude}&key=${GoogleMapKey}`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log({responseJson});
        let temp = JSON.parse(JSON.stringify(responseJson));
        if (temp?.results && temp?.results?.length > 0) {
          googlePlaceRef?.current?.setAddressText(
            temp?.results[0]?.formatted_address,
          );
          setAddress(temp?.results[0]?.formatted_address);
          temp?.results[0].address_components.forEach((item, index) => {
            if (
              item?.types?.findIndex((ele) => ele === 'sublocality_level_1') !==
              -1
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
            t1.address_line2 = temp?.results[0]?.formatted_address;
          });
        }
      });
    t1.latitude = regionData?.latitude;
    t1.longitude = regionData?.longitude;
    setLoading(false);
    setMapData(t1);
  };
  const handleState = (key, value) => {
    console.log({value});
    console.log({key});

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

  console.log({destination});

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
        MAKE MOVE
      </Text>
      <View style={{marginTop: hp(3)}}>
        {isAndroid ? (
          <Pressable onPress={() => setMapVisible(true)}>
            <TextInput
              disable={true}
              selection={{start: 0}}
              label={props.movingFrom ? 'To *' : 'From *'}
              isRight={error?.geocode}
              value={
                props.movingFrom
                  ? destination?.meta?.geocode
                  : source?.meta?.geocode
              }
              placeHolder={'Choose on map'}
            />
          </Pressable>
        ) : (
          <TextInput
            caretHidden={true}
            onFocus={() => {
              Keyboard.dismiss();
              setMapVisible(true);
            }}
            selection={{start: 0}}
            label={props.movingFrom ? 'To *' : 'From *'}
            isRight={error?.geocode}
            value={
              props.movingFrom
                ? destination?.meta?.geocode
                : source?.meta?.geocode
            }
            placeHolder={'Choose on map'}
          />
        )}

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
          label={'Address Line 1 *'}
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
          label={'Address Line 2 *'}
          isRight={error.address_line2}
          placeHolder={'Landmark, Area'}
          selection={isKeyboardOpen ? {end: 0} : {start: 0}}
          value={
            props.movingFrom
              ? destination?.meta?.address_line2
              : source?.meta?.address_line2
          }
          onChange={(text) => handleState('address_line2', text)}
        />
        <TextInput
          label={'City *'}
          isRight={error.city}
          value={
            props.movingFrom ? destination?.meta?.city : source?.meta?.city
          }
          placeHolder={'City'}
          onChange={(text) => handleState('city', text)}
        />
        <TextInput
          label={'State *'}
          isRight={error.state}
          value={
            props.movingFrom ? destination?.meta?.state : source?.meta?.state
          }
          placeHolder={'State'}
          onChange={(text) => handleState('state', text)}
        />
        <TextInput
          label={'Pin code *'}
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
            width: Platform.OS === 'android' ? '100%' : '96%',
          }}>
          <View
            style={{
              width: Platform.OS === 'android' ? wp(56) : '66%',
            }}>
            <TextInput
              label={'Floor *'}
              isRight={error.floor}
              value={
                props.movingFrom
                  ? destination?.meta?.floor.toString()
                  : source?.meta?.floor.toString()
              }
              maxLength={2}
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
                  ? destination?.meta?.floor < 99
                  : source?.meta?.floor < 99
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
              My Flat/Apartment has SERVICE Lift.
            </Text>
          </View>
          {/* {props.movingFrom ? (
            <Switch
              onChange={(text) => handleState('lift', text)}
              value={destination?.meta?.lift}
            />
          ) : (
            <Switch
              onChange={(text) => handleState('lift', text)}
              value={source?.meta?.lift}
            />
          )} */}

          <Switch
            onChange={(text) => handleState('lift', text)}
            value={
              props.movingFrom ? destination?.meta?.lift : source?.meta?.lift
            }
          />
        </View>
        <Text
          style={{
            color: '#99A0A5',
            marginTop: 10,
            fontFamily: 'Roboto-Italic',
            fontSize: wp(3.5),
            marginHorizontal: wp(3),
            textAlign: 'center',
          }}>
          This will help us to move your things in a better way
        </Text>
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
                pageData?.floor > 99
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
                  let obj = {
                    url: 'bookings/track/destination',
                    method: 'put',
                    headers: {
                      Authorization:
                        'Bearer ' + STORE.getState().Login?.loginData?.token,
                    },
                    data: {
                      public_booking_id: data?.booking_id,
                      destination: data?.destination,
                    },
                  };
                  APICall(obj)
                    .then((res) => {
                      if (res?.data?.status === 'success') {
                        if (props.bookingFor === 'Others') {
                          props.onPageChange(2);
                        } else {
                          props.onPageChange(1);
                        }
                      } else {
                        CustomAlert(res?.data?.message);
                      }
                    })
                    .catch((err) => {
                      CustomAlert(err?.data?.message);
                      CustomConsole(err);
                    });
                } else {
                  let obj = {
                    url: 'bookings/track/source',
                    method: 'put',
                    headers: {
                      Authorization:
                        'Bearer ' + STORE.getState().Login?.loginData?.token,
                    },
                    data: {
                      public_booking_id: data?.booking_id,
                      service_id: data?.service_id,
                      source: data?.source,
                    },
                  };
                  APICall(obj)
                    .then((res) => {
                      if (res?.data?.status === 'success') {
                        props.changeTo();
                      } else {
                        CustomAlert(res?.data?.message);
                      }
                    })
                    .catch((err) => {
                      CustomAlert(err?.data?.message);
                      CustomConsole(err);
                    });
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
              onRegionChangeComplete={(region1) => {
                if (
                  !isKeyboardOpen &&
                  region1.latitude.toFixed(6) !== region.latitude.toFixed(6) &&
                  region1.longitude.toFixed(6) !== region.longitude.toFixed(6)
                ) {
                  if (Platform.OS === 'android') {
                    fetchLocationString(region1);
                  }
                }
              }}
              zoomEnabled={true}
              // minZoomLevel={0}
              // maxZoomLevel={20}
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
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
              />
              {!props.movingFrom &&
                zones.map((item, index) => {
                  let coords = item.coordinates.map((coordsArr) => {
                    let newCoordinates = {
                      latitude: coordsArr.lat,
                      longitude: coordsArr.lng,
                    };
                    return newCoordinates;
                  });
                  return (
                    // <MapView.Circle
                    //   key={index}
                    //   center={{
                    //     latitude: item?.coordinates[0].lat,
                    //     longitude: item?.coordinates[0].lng,
                    //   }}
                    //   radius={5000}
                    //   strokeWidth={1}
                    //   strokeColor={Colors.darkBlue}
                    //   fillColor={'rgba(230,238,255,0.5)'}
                    // />

                    <Polygon
                      coordinates={coords}
                      strokeWidth={2}
                      strokeColor={Colors.darkBlue}
                      fillColor="rgba(230,238,255,0.5)"
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
              currentLocationLabel={'Current Location'}
              query={{
                key: GoogleMapKey,
                language: 'en',
              }}
              styles={{
                textInputContainer: {
                  borderWidth: 2,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  height: hp(6),
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
                //to get distance between two coordinates
                //destination
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
                      if (res?.status === 200) {
                        if (res?.data?.data?.distance > 0) {
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
                  //get the source and check if the service is available in selected area

                  let obj = {
                    url: 'zone/check-serviceability',
                    method: 'post',
                    headers: {
                      Authorization:
                        'Bearer ' + STORE.getState().Login?.loginData?.token,
                    },
                    data: {
                      latitude: mapData.latitude,
                      longitude: mapData.longitude,
                    },
                  };
                  APICall(obj)
                    .then((res) => {
                      setLoading(false);
                      if (res?.status === 200) {
                        if (res?.data?.data.serviceable) {
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

                  // let count = 0;
                  // zones.forEach((item, index) => {
                  //   let temp = getDistance(
                  //     {
                  //       latitude: mapData?.latitude,
                  //       longitude: mapData?.longitude,
                  //     },
                  //     {latitude: item?.lat, longitude: item?.lng},
                  //   );
                  //   if (temp <= item?.service_radius * 1000) {
                  //     count = count + 1;
                  //   }
                  // });

                  // if (count > 0) {
                  //   let temp = {...source};
                  //   temp.meta.address_line1 = mapData.address_line1;
                  //   temp.meta.address_line2 = mapData.address_line2;
                  //   temp.meta.city = mapData.city;
                  //   temp.meta.pincode = mapData.pincode;
                  //   temp.meta.state = mapData.state;
                  //   temp.meta.geocode = mapData.geocode;
                  //   temp.lat = mapData.latitude;
                  //   temp.lng = mapData.longitude;
                  //   handleStateChange('source', temp);
                  //   setMapVisible(false);
                  // } else {
                  //   alert(
                  //     'Your location is not currently serviceable by biddnest. We will be expanding soon.',
                  //   );
                  // }
                }
              }}
            />
          </View>
        </MapModalAndroid>
        <InformationPopUp
          visible={liftInfo}
          label={
            'Mentioning this helps us being better prepaid for your moment'
          }
          title={'service lift'}
          onCloseIcon={() => {
            setLiftInfo(false);
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(MovingForm);

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
    height: hp(6),
    width: hp(6),
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.btnBG,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.3),
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
