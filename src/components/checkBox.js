import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import Feather from 'react-native-vector-icons/Feather';

const CheckBox = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.checkBoxView,
        {
          borderColor: props.value ? '#0F0C75' : Colors.grey,
          backgroundColor: props.value ? '#0F0C75' : Colors.transparent,
          ...styles.common,
        },
      ]}>
      {props.value && (
        <Feather
          name={'check'}
          size={15}
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
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: wp(2),
  },
});
