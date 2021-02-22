import React from 'react';
import {Colors, hp, wp} from '../constant/colors';
import {STYLES} from '../constant/commonStyle';
import {Pressable, Text} from 'react-native';

const FlatButton = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        height: hp(7),
        backgroundColor: Colors.btnBG,
        width: wp(100),
        marginTop: hp(2),
        ...STYLES.common,
      }}>
      <Text
        style={{
          fontFamily: 'Roboto-Bold',
          color: Colors.white,
          fontSize: wp(5),
        }}>
        {props.label}
      </Text>
    </Pressable>
  );
};

export default FlatButton;
