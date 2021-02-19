import React from 'react';
import {Input} from 'react-native-elements';
import {hp, Colors, wp} from '../constant/colors';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TextInput = (props) => {
  return (
    <Input
      keyboardType={props.keyboard || 'default'}
      placeholder={props.placeHolder}
      label={props.label}
      rightIcon={
        props.isRight ? (
          <Feather name="check" size={25} color={Colors.lightGreen} />
        ) : (
          <Ionicons name="close-outline" size={25} color={Colors.red} />
        )
      }
      inputContainerStyle={{
        borderWidth: 2,
        paddingHorizontal: 15,
        borderRadius: 10,
        height: hp(6.5),
        marginTop: hp(1),
        borderColor: Colors.silver,
      }}
      labelStyle={{
        fontFamily: 'Roboto-Bold',
        color: Colors.textLabelColor,
        fontSize: wp(4),
      }}
      inputStyle={{
        fontSize: wp(4),
        backgroundColor: Colors.textBG,
        color: Colors.inputTextColor,
      }}
    />
  );
};

export default TextInput;
