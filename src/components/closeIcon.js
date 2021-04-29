import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp} from '../constant/colors';
import {Pressable} from 'react-native';

const CloseIcon = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={
        props.style
          ? props.style
          : {position: 'absolute', right: hp(2), top: hp(2)}
      }>
      <Ionicons name="close-sharp" size={hp(3.3)} color={'#C9CDCF'} />
    </Pressable>
  );
};

export default CloseIcon;
