import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import {STYLES} from '../constant/commonStyle';
import React from 'react';

const TwoButton = (props) => {
  if (props.isLoading) {
    return <ActivityIndicator size="large" color={Colors.darkBlue} />;
  }
  return (
    <View
      style={{
        flex: 1,
        height: hp(6),
        flexDirection: 'row',
        width: wp(100),
        marginTop: hp(4),
      }}>
      <Pressable
        onPress={props.leftOnPress}
        style={{
          flex: 1,
          borderWidth: 3,
          borderColor: Colors.btnBG,
          ...STYLES.common,
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            color: Colors.btnBG,
            fontSize: wp(3.5),
            textTransform: 'uppercase',
          }}>
          {props.leftLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={props.rightOnPress}
        style={{flex: 1, backgroundColor: Colors.btnBG, ...STYLES.common}}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            color: Colors.white,
            fontSize: wp(3.5),
            textTransform: 'uppercase',
          }}>
          {props.rightLabel}
        </Text>
      </Pressable>
    </View>
  );
};

export default TwoButton;
