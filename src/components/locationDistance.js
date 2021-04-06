import {Colors, hp, wp} from '../constant/colors';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {STYLES} from '../constant/commonStyle';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {STORE} from '../redux';
import {APICall} from '../redux/actions/user';
import {CustomAlert, CustomConsole} from '../constant/commonFun';

const LocationDistance = (props) => {
  const [cDistance, setCDistance] = useState('');
  useEffect(() => {
    if (props.distance) {
      calculateDistance(props.distance);
    }
  }, []);
  const calculateDistance = async (body) => {
    let obj = {
      url: 'bookings/distance',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
      data: body,
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setCDistance(res?.data?.data?.distance);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        marginTop: hp(2),
        padding: hp(2),
        flexDirection: 'row',
      }}>
      <Image
        source={require('../assets/images/pin_distance.png')}
        style={{height: wp(15), width: wp(10)}}
        resizeMode={'contain'}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{width: '50%'}}>
          <Text
            numberOfLines={1}
            style={[
              styles.locationText,
              {
                marginTop: 0,
                fontFamily: 'Gilroy-SemiBold',
                textTransform: 'capitalize',
              },
            ]}>
            {props.from ? props.from : ''}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.locationText,
              {fontFamily: 'Gilroy-SemiBold', textTransform: 'capitalize'},
            ]}>
            {props.to ? props.to : ''}
          </Text>
        </View>
        {(props.inTransit && (
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            {/*<Text style={styles.inTransitText}>In Transit</Text>*/}
            <Text style={styles.inTransitText}>04:10</Text>
            <View
              style={{
                ...styles.transitArrow,
                ...STYLES.common,
              }}>
              <Ionicons
                name={'arrow-forward-sharp'}
                size={30}
                color={Colors.white}
              />
            </View>
          </View>
        )) || (
          <View style={{alignItems: 'center', maxWidth: '45%'}}>
            <Text style={[styles.locationText, {marginTop: 0}]}>DISTANCE</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(1),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: wp(5),
                  color: Colors.inputTextColor,
                }}>
                {props.finalDistance
                  ? props.finalDistance + ' KM'
                  : props.distance
                  ? cDistance + ' KM'
                  : '314KM'}
              </Text>
              {props.onEditClick && (
                <Pressable style={{marginLeft: 10}} onPress={props.onEditClick}>
                  <SimpleLineIcons
                    name={'pencil'}
                    size={16}
                    color={Colors.darkBlue}
                  />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default LocationDistance;

const styles = StyleSheet.create({
  locationText: {
    fontFamily: 'Gilroy-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(2),
    textTransform: 'uppercase',
  },
  inTransitText: {
    fontFamily: 'Roboto-Bold',
    color: Colors.darkBlue,
    fontSize: wp(4),
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#EEE5FC',
    borderRadius: 5,
    overflow: 'hidden',
  },
  transitArrow: {
    height: 40,
    width: 40,
    backgroundColor: Colors.btnBG,
    borderRadius: 20,
    marginLeft: 10,
  },
});
