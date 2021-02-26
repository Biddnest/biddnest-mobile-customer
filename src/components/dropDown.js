import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../constant/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DropDown = (props) => {
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
        style={
          {
            // zIndex: 10,
            // minHeight: hp(5)
          }
        }>
        <DropDownPicker
          items={props.items}
          defaultValue={props.items[0]?.value}
          customArrowUp={() => (
            <MaterialIcons name="arrow-drop-up" size={25} color={'#3B4B58'} />
          )}
          customArrowDown={() => (
            <MaterialIcons name="arrow-drop-down" size={25} color={'#3B4B58'} />
          )}
          containerStyle={{
            height: hp(6.5),
            // borderWidth: 1,
            // borderRadius: 10,
            // borderColor: Colors.silver,
          }}
          style={[
            styles.customDropDown,
            {
              paddingHorizontal: 15,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
          ]}
          labelStyle={{
            fontSize: wp(4),
            backgroundColor: Colors.textBG,
            color: Colors.inputTextColor,
          }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          dropDownStyle={styles.customDropDown}
          onChangeItem={(item) => props.onChangeItem(item.value)}
        />
      </View>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customDropDown: {
    backgroundColor: Colors.textBG,
  },
});
