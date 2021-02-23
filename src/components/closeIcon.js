import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../constant/colors';
import {Pressable} from 'react-native';

const CloseIcon = (props) => {
  return (
    <Pressable onPress={props.onPress} style={props.style}>
      <Ionicons name="close-sharp" size={25} color={Colors.silver} />
    </Pressable>
  );
};

export default CloseIcon;
