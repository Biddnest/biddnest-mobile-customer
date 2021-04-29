import React from 'react';
import {Image, Pressable, View, Text, StyleSheet} from 'react-native';
import {boxShadow, Colors, hp, wp} from '../constant/colors';
import BackArrow from '../assets/svg/back_arrow.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SimpleHeader = (props) => {
  return (
    <View
      style={[
        boxShadow,
        {
          height: hp(7.5),
          backgroundColor: Colors.white,
          flexDirection: 'row',
        },
      ]}>
      <Pressable
        style={{
          width: wp(13),
          height: '100%',
          ...styles.common,
        }}
        onPress={() => {
          props.onBack();
        }}>
        {(props.closeIcon && (
          <Ionicons name="close-sharp" size={hp(3.5)} color={Colors.black} />
        )) || <BackArrow width={wp(20)} height={hp(20)} />}
      </Pressable>
      <View style={{width: wp(87), height: '100%', ...styles.common}}>
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: wp(5),
            color: Colors.inputTextColor,
            marginRight: wp(13),
            textTransform: 'capitalize',
          }}>
          {props.headerText}
        </Text>
      </View>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
