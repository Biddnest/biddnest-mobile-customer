import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';

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
      <View
        style={[
          styles.outerView,
          {width: '100%', paddingHorizontal: 0, ...props?.style},
        ]}>
        <Picker
          style={{
            height: '99%',
            width: '100%',
          }}
          selectedValue={props.value}
          onValueChange={(item) => {
            let temp = props.items.find((t, ind) => t.value === item);
            props.onChangeItem(item, temp);
          }}>
          {props?.items?.map((item, index) => {
            return <Picker.Item label={item?.label} value={item?.value} />;
          })}
        </Picker>
      </View>
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
    flexDirection: 'row',
  },
});
