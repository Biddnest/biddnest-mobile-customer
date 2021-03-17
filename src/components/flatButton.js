import React from 'react';
import {Colors, hp, wp} from '../constant/colors';
import {STYLES} from '../constant/commonStyle';
import {ActivityIndicator, Pressable, Text} from 'react-native';

const FlatButton = (props) => {
  return (
    <Pressable
      onPress={() => !props.isLoading && props.onPress()}
      style={{
        height: hp(7),
        backgroundColor: Colors.btnBG,
        width: wp(100),
        marginTop: hp(2),
        ...STYLES.common,
      }}>
      {(props.isLoading && (
        <ActivityIndicator size="small" color={Colors.white} />
      )) || (
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            color: Colors.white,
            fontSize: wp(5),
          }}>
          {props.label}
        </Text>
      )}
    </Pressable>
  );
};

export default FlatButton;
