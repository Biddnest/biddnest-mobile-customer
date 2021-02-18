import React from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';

const Button = (props) => {
  return (
    <Pressable
      onPress={() => {
        if (!props.isLoading) {
          props.onPress();
        }
      }}
      style={{
        backgroundColor: Colors.btnBG,
        height: hp(6),
        width: wp(85),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: hp(2.5),
        borderRadius: hp(1),
      }}>
      {(props.isLoading && (
        <ActivityIndicator size="small" color={Colors.white} />
      )) || (
        <Text
          style={{
            fontSize: wp(4),
            color: Colors.white,
            fontFamily: 'Roboto-Bold',
          }}>
          {props.label}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
