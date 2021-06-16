import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import {Dropdown} from 'react-native-material-dropdown';

const SelectionModalAndroid = (props) => {
  return (
    <View
      style={{
        width: props.width ? props.width : wp(45),
        paddingHorizontal: 10,
      }}>
      <Text
        style={{
          fontFamily: 'Roboto-Bold',
          color: Colors.textLabelColor,
          fontSize: wp(4),
          marginBottom: hp(1),
        }}>
        {props.label}
      </Text>
      <Dropdown
        labelFontSize={0}
        containerStyle={[styles.outerView, {width: '100%', ...props?.style}]}
        rippleOpacity={0}
        inputContainerStyle={{
          width: props.width ? props.width - wp(15) : wp(45),
          borderBottomColor: 'transparent',
          justifyContent: 'center',
          flex: 1,
        }}
        onChangeText={(value, index, data) => {
          props.onChangeItem(value, data);
        }}
        dropdownOffset={{top: hp(1.6)}}
        itemTextStyle={{
          fontFamily: 'Gilroy-SemiBold',
          fontSize: wp(4),
          color: Colors.inputTextColor,
          textTransform: 'capitalize',
        }}
        style={{
          fontFamily: 'Gilroy-SemiBold',
          fontSize: wp(4),
          color: Colors.inputTextColor,
          textTransform: 'capitalize',
        }}
        value={props.value || '-Select-'}
        data={props?.items}
      />
    </View>
  );
};

export default SelectionModalAndroid;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customDropDown: {
    backgroundColor: Colors.textBG,
  },
  outerView: {
    borderWidth: 2,
    borderRadius: 10,
    height: hp(6),
    borderColor: Colors.silver,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
});
