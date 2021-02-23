import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import {STYLES} from '../../../constant/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderTracking = (props) => {
  return (
    <View style={styles.container}>
      <SimpleHeader
        headerText={'ORDER TRACKING'}
        navigation={props.navigation}
        onBack={() => {}}
      />
      <View
        style={{
          backgroundColor: Colors.white,
          marginTop: 5,
          padding: hp(2),
          flexDirection: 'row',
        }}>
        <View />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
          }}>
          <View>
            <Text style={{...styles.locationText, marginTop: 0}}>CHENNAI</Text>
            <Text style={styles.locationText}>BENGALURU</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{...styles.locationText, marginTop: 0}}>
              ID:{' '}
              <Text
                style={{
                  fontFamily: 'Gilroy-Extrabold',
                }}>
                #123456
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(1),
              }}>
              <Text
                style={{
                  fontFamily: 'Gilroy-Extrabold',
                  fontSize: wp(4.5),
                  color: Colors.inputTextColor,
                }}>
                314KM
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        {[
          {icon: 'phone-call', title: 'Virtual Assistance'},
          {icon: 'file-text', title: 'Order Details'},
          {icon: 'share-2', title: 'Share'},
          {icon: 'test', title: 'Manage Order'},
        ].map((item, index) => {
          return (
            <View
              style={{
                marginTop: hp(2),
                ...STYLES.common,
              }}>
              <View
                key={index}
                style={{
                  ...styles.btnView,
                  ...STYLES.common,
                }}>
                <Feather
                  name={item.icon}
                  size={wp(8)}
                  color={Colors.darkBlue}
                />
              </View>
              <Text numberOfLines={1} style={styles.btnText}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
      <View
        style={{
          ...styles.inputForm,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{...styles.driverContact, fontFamily: 'Roboto-Medium'}}>
            DRIVER
          </Text>
          <Text style={{...styles.driverContact, marginTop: 10}}>
            Name <Text style={{fontFamily: 'Roboto-Regular'}}>Omkar patil</Text>
          </Text>
          <Text style={{...styles.driverContact, marginTop: 5}}>
            Phone <Text style={{fontFamily: 'Roboto-Regular'}}>9090909090</Text>
          </Text>
        </View>
        <View
          style={{
            height: wp(15),
            width: wp(15),
            borderRadius: wp(7.5),
            backgroundColor: '#F2E6FF',
            ...STYLES.common,
          }}>
          <Ionicons name={'call'} color={Colors.darkBlue} size={wp(7)} />
        </View>
      </View>
    </View>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  locationText: {
    fontFamily: 'Gilroy-Light',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(2),
  },
  btnView: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    borderWidth: 0.8,
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  btnText: {
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.2),
    color: Colors.inputTextColor,
    maxWidth: wp(25),
    textAlign: 'center',
  },
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  driverContact: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(4),
    color: Colors.inputTextColor,
  },
});
