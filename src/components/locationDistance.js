import {Colors, hp, wp} from '../constant/colors';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {STYLES} from '../constant/commonStyle';
import EditPen from '../assets/svg/edit_pen.svg';

const LocationDistance = (props) => {
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
        <View>
          <Text style={[styles.locationText, {marginTop: 0}]}>
            {props.from ? props.from : 'CHENNAI'}
          </Text>
          <Text style={styles.locationText}>
            {props.to ? props.to : 'BENGALURU'}
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
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.locationText, {marginTop: 0}]}>DISTANCE</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(1),
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: wp(5),
                  color: Colors.inputTextColor,
                }}>
                {props.distance
                  ? parseInt(props.distance / 1000) + ' KM'
                  : '314KM'}
              </Text>
              {props.onEditClick && (
                <Pressable style={{marginLeft: 10}} onPress={props.onEditClick}>
                  <EditPen width={30} height={30} />
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
