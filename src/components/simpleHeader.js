import React from 'react';
import {Image, Pressable, View, Text, StyleSheet} from 'react-native';
import {boxShadow, Colors, wp} from '../constant/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';

const SimpleHeader = (props) => {
  return (
    <View
      style={[
        boxShadow,
        {
          height: 55,
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
        <Fontisto name={'arrow-left-l'} size={25} color={Colors.black} />
      </Pressable>
      <View style={{width: wp(87), height: '100%', ...styles.common}}>
        <Text
          style={{
            fontFamily: 'Gilroy-Medium',
            fontSize: wp(5),
            color: Colors.inputTextColor,
            marginRight: wp(13),
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
