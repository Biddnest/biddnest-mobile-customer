import React from 'react';
import {Input} from 'react-native-elements';
import {hp, Colors, wp} from '../constant/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Pressable, Text} from 'react-native';

const TextInput = (props) => {
  return (
    <Input
      autoFocus={props.autoFocus || false}
      autoCapitalize={props.autoCapitalize ? 'characters' : 'none'}
      disabled={props.disable || false}
      keyboardType={props.keyboard || 'default'}
      placeholder={props.placeHolder}
      multiline={!!props.numberOfLines}
      numberOfLines={props.numberOfLines || 1}
      value={props.value}
      onFocus={props.onFocus}
      selection={props?.selection}
      onBlur={props.onBlur}
      label={props.label}
      leftIcon={() => {
        if (props?.isLeft) {
          return (
            <Text
              style={{
                fontFamily: 'Gilroy-SemiBold',
                fontSize: wp(4),
                color: Colors.inputTextColor,
              }}>
              +91
            </Text>
          );
        }
      }}
      rightIcon={() => {
        if (props.isRight === true) {
          return (
            <Ionicons
              name="checkmark-sharp"
              size={hp(3.5)}
              color={Colors.lightGreen}
            />
          );
        } else if (props.isRight === false) {
          return (
            <Ionicons name="close-outline" size={hp(3.5)} color={Colors.red} />
          );
        } else if (props?.isRight === 'search') {
          return (
            <Pressable onPress={props.searchPress}>
              <Ionicons name={props.icon} size={hp(3)} color={'#C9CDCF'} />
            </Pressable>
          );
        }
      }}
      onChangeText={props.onChange}
      inputContainerStyle={{
        borderWidth: 2,
        paddingHorizontal: 15,
        borderRadius: 10,
        height: props.numberOfLines
          ? props.height
            ? props.height
            : hp(12)
          : hp(6),
        marginTop: hp(1),
        borderColor: props.isRight === false ? Colors.red : Colors.silver,
        backgroundColor: Colors.white,
        borderBottomWidth: 2,
      }}
      containerStyle={{
        marginBottom: -hp(1),
      }}
      maxLength={props?.maxLength || 10000000}
      labelStyle={{
        fontFamily: 'Roboto-Bold',
        color: Colors.textLabelColor,
        fontSize: wp(4),
      }}
      inputStyle={{
        fontFamily: 'Gilroy-SemiBold',
        fontSize: wp(4),
        backgroundColor: Colors.textBG,
        color: Colors.inputTextColor,
        height: '98%',
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        // borderColor: props.isRight === false ? Colors.red : Colors.silver,
        textAlignVertical: props.numberOfLines ? 'top' : 'center',
      }}
    />
  );
};

export default TextInput;
