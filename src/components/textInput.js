import React from 'react';
import {Input} from 'react-native-elements';
import {hp, Colors, wp} from '../constant/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TextInput = (props) => {
  return (
    <Input
      disabled={props.disable || false}
      keyboardType={props.keyboard || 'default'}
      placeholder={props.placeHolder}
      label={props.label}
      rightIcon={() => {
        if (props.isRight === true) {
          return (
            <Ionicons
              name="checkmark-sharp"
              size={25}
              color={Colors.lightGreen}
            />
          );
        } else if (props.isRight === false) {
          return <Ionicons name="close-outline" size={25} color={Colors.red} />;
        }
      }}
      onChangeText={props.onChange}
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
