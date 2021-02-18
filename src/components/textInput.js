import React from 'react';
import {Input} from 'react-native-elements';
import {hp, Colors, wp} from '../constant/colors';

const TextInput = (props) => {
  return (
    <Input
      keyboardType={props.keyboard || 'default'}
      placeholder={props.placeHolder}
      label={props.label}
      // rightIcon={{type: 'font-awesome', name: 'comment'}}
      inputContainerStyle={{
        borderWidth: 2,
        paddingHorizontal: 20,
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
