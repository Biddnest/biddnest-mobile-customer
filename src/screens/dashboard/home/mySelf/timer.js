import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
  DiffMin,
} from '../../../../constant/commonFun';
import CustomModalAndroid from '../../../../components/customModal';
import CloseIcon from '../../../../components/closeIcon';
import {STYLES} from '../../../../constant/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import {STORE} from '../../../../redux';
import {APICall} from '../../../../redux/actions/user';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Requirements from '../../myBooking/requirements';
import MapModalAndroid from '../../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import FlatButton from '../../../../components/flatButton';
import LinearGradient from 'react-native-linear-gradient';

const Timer = (props) => {
  const [orderPlacedVisible, setOrderPlacedVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [time, setTime] = useState(
    DiffMin(props?.apiResponse?.bid_result_at) || 0,
  );
  const [tab, setTab] = useState(['Order Details', 'Requirements', 'My Bid']);
  const [selectedTab, setSelectedTab] = useState(2);
  const [mapVisible, setMapVisible] = useState(null);
  let coordinates =
    mapVisible === 'pickup'
      ? {
          latitude: parseFloat(orderDetails?.source_lat),

          longitude: parseFloat(orderDetails?.source_lng),
        }
      : {
          latitude: parseFloat(orderDetails?.destination_lat),
          longitude: parseFloat(orderDetails?.destination_lng),
        };
  let source_meta =
    (orderDetails?.source_meta &&
      JSON.parse(orderDetails?.source_meta?.toString())) ||
    {};
  let destination_meta =
    (orderDetails?.destination_meta &&
      JSON.parse(orderDetails?.destination_meta?.toString())) ||
    {};
  useEffect(() => {
    let obj = {
      url: `bookings?id=${props?.apiResponse?.public_booking_id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setOrderDetails(res?.data?.data?.booking);
          setOrderPlacedVisible(true);
          if (res?.data?.data?.booking?.bid_result_at) {
            let temp = DiffMin(res?.data?.data?.booking?.bid_result_at);
            setTime(temp);
          }
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  }, []);
  const children = ({remainingTime}) => {
    return (
      <Text
        style={{
          color: Colors.darkBlue,
          fontSize: wp(5),
          fontFamily: 'Gilroy-Bold',
        }}>
        {new Date(remainingTime * 1000).toISOString().substr(11, 8)}
      </Text>
    );
  };
  const renderText = (key, value) => {
    return (
      <View>
        <Text style={STYLES.staticLabel}>{key}</Text>
        <Text
          style={[
            STYLES.staticLabel,
            {
              fontFamily: 'Roboto-Regular',
              marginTop: 5,
            },
          ]}>
          {value}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <View style={STYLES.tabView}>
        {tab.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={{
                ...STYLES.common,
                borderColor:
                  selectedTab === index ? Colors.darkBlue : '#ACABCD',
                borderBottomWidth: selectedTab === index ? 2 : 0,
              }}
              onPress={() => setSelectedTab(index)}>
              <Text
                style={{
                  ...STYLES.tabText,
                  color: selectedTab === index ? Colors.darkBlue : '#ACABCD',
                }}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selectedTab === 0 && (
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '80%'}}>
              {renderText('Pickup Address', source_meta?.address)}
            </View>
            <Pressable
              style={STYLES.mapPinCircle}
              onPress={() => setMapVisible('pickup')}>
              <Feather name={'map-pin'} color={Colors.darkBlue} size={wp(7)} />
            </Pressable>
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
            }}>
            {renderText('Pincode', source_meta?.pincode)}
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              {renderText('Floor', source_meta?.floor)}
            </View>
            <View style={{flex: 1}}>
              {renderText('Lift', source_meta?.lift == 1 ? 'Yes' : 'No')}
            </View>
          </View>
          <View
            style={[STYLES.separatorView, {width: '90%', alignSelf: 'center'}]}
          />
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '80%'}}>
              {renderText('Drop Address', destination_meta?.address)}
            </View>
            <Pressable
              style={STYLES.mapPinCircle}
              onPress={() => setMapVisible('drop')}>
              <Feather name={'map-pin'} color={Colors.darkBlue} size={wp(7)} />
            </Pressable>
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
            }}>
            {renderText('Pincode', destination_meta?.pincode)}
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              {renderText('Floor', destination_meta?.floor)}
            </View>
            <View style={{flex: 1}}>
              {renderText('Lift', destination_meta?.lift == 1 ? 'Yes' : 'No')}
            </View>
          </View>
        </ScrollView>
      )}
      {selectedTab === 1 && (
        <Requirements
          navigation={props.navigation}
          orderDetails={orderDetails}
        />
      )}
      {selectedTab === 2 && (
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontFamily: 'Roboto-Italic',
              fontSize: wp(3.5),
              color: '#99A0A5',
              textAlign: 'center',
              marginHorizontal: wp(6),
              marginTop: hp(2),
            }}>
            You’ll get the estimated price once the time is up
          </Text>
          <View style={styles.inputForm}>
            <View style={{marginVertical: hp(0.8)}}>
              <CountdownCircleTimer
                key={new Date()}
                size={hp(25)}
                isPlaying
                duration={300}
                initialRemainingTime={time}
                children={children}
                colors={[[Colors.darkBlue, 0.4]]}
                onComplete={() => resetNavigator(props, 'Dashboard')}
              />
            </View>
            <Text style={styles.mainText}>Time Left</Text>
            <View style={styles.separatorView} />
            <View style={styles.flexView}>
              <Text style={styles.orderID}>ORDER ID</Text>
              <Text style={styles.orderNo}>
                {orderDetails?.public_booking_id}
              </Text>
            </View>
            <Button
              spaceBottom={0}
              label={'GO TO HOME'}
              onPress={() => resetNavigator(props, 'Dashboard')}
            />
          </View>
        </ScrollView>
      )}
      <MapModalAndroid
        visible={mapVisible !== null}
        onPress={() => setMapVisible(null)}>
        <View style={styles.mapView}>
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            style={{flex: 1}}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={coordinates} />
          </MapView>
        </View>
        <CloseIcon
          onPress={() => setMapVisible(null)}
          style={[
            {
              position: 'absolute',
              right: hp(2),
              top: hp(2),
              height: hp(5),
              width: hp(5),
              borderRadius: hp(2.5),
              zIndex: 5000,
              backgroundColor: Colors.white,
              ...STYLES.common,
            },
          ]}
        />
        <View style={{marginVertical: hp(3), width: wp(90)}}>
          {renderText(
            mapVisible === 'pickup' ? 'Pickup Address' : 'Drop Address',
            mapVisible === 'pickup'
              ? source_meta?.address
              : destination_meta?.address,
          )}
        </View>
        <View style={{marginTop: hp(1)}}>
          <FlatButton
            label={'open in maps app'}
            onPress={() => {
              let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
              Linking.openURL(
                scheme + `${coordinates.latitude},${coordinates.longitude}`,
              );
            }}
          />
        </View>
      </MapModalAndroid>
      <CustomModalAndroid
        visible={orderPlacedVisible}
        onPress={() => setOrderPlacedVisible(false)}>
        <CloseIcon onPress={() => setOrderPlacedVisible(false)} />
        <View
          style={{
            ...styles.circleView,
            ...STYLES.common,
          }}>
          <Feather name={'check'} size={wp(15)} color={Colors.btnBG} />
        </View>
        <Text
          style={[
            styles.mainText,
            {
              fontSize: wp(4),
              marginBottom: hp(2),
            },
          ]}>
          Order Placed Successfully!
        </Text>
        <View style={styles.separatorView} />
        <View
          style={[
            styles.flexView,
            {
              marginBottom: hp(2),
            },
          ]}>
          <Text style={styles.orderID}>ORDER ID</Text>
          <Text style={styles.orderNo}>{orderDetails?.public_booking_id}</Text>
        </View>
      </CustomModalAndroid>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    marginVertical: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    alignItems: 'center',
  },
  mainText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '90%',
    marginVertical: hp(2),
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  orderID: {
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  orderNo: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  circleView: {
    height: wp(25),
    width: wp(25),
    marginTop: 35,
    borderRadius: wp(12.5),
    backgroundColor: Colors.white,
    borderWidth: 4,
    marginBottom: hp(3),
    borderColor: Colors.btnBG,
  },
  mapView: {
    height: hp(67),
    width: wp(100),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
});
