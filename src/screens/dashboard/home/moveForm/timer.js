import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {resetNavigator} from '../../../../constant/commonFun';
const Timer = (props) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Text
        style={{
          fontFamily: 'Roboto-Italic',
          fontSize: wp(3.5),
          color: '#99A0A5',
          textAlign: 'center',
          marginHorizontal: wp(6),
        }}>
        You’ll get the estimated price once the time is up
      </Text>
      <View style={styles.inputForm}>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: wp(3.5),
            color: Colors.inputTextColor,
          }}>
          Time Left
        </Text>
        <View
          style={{
            borderWidth: 0.8,
            borderColor: Colors.silver,
            width: '90%',
            marginVertical: hp(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <Text
            style={{
              fontFamily: 'Gilroy-Light',
              fontSize: wp(3.5),
              color: Colors.inputTextColor,
            }}>
            ORDER ID
          </Text>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: wp(3.5),
              color: Colors.inputTextColor,
            }}>
            #34123
          </Text>
        </View>
        <Button
          spaceBottom={0}
          label={'GO TO HOME'}
          onPress={() => resetNavigator(props, 'Dashboard')}
        />
      </View>
    </ScrollView>
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
