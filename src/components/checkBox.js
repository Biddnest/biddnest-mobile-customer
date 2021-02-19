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
