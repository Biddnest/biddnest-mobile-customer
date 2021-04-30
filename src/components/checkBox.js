import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckBox = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.checkBoxView,
        {
          borderColor: props.value ? Colors.darkBlue : Colors.grey,
          backgroundColor: props.value ? Colors.darkBlue : Colors.transparent,
          ...styles.common,
        },
      ]}>
      {props.value && (
        <Ionicons
          name={'checkmark-sharp'}
          size={hp(2)}
          color={Colors.white}
          style={{fontWeight: 'bold'}}
        />
      )}
    </Pressable>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxView: {
    height: hp(2.5),
    width: hp(2.5),
    borderWidth: 2,
    borderRadius: hp(0.5),
    marginRight: wp(2),
  },
});
