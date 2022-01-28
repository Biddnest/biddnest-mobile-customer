import React, {useEffect, useState} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {Colors, wp, hp} from '../constant/colors';

const Switch = (props) => {
  const [switchValue, setSwitchValue] = useState(0);

  useEffect(() => {
    setSwitchValue(props.value);
  }, [props.value, switchValue]);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Pressable
        onPress={() => {
          setSwitchValue(!props.value);
          props.onChange(props.value === 0 ? 1 : 0);
        }}
        style={{
          height: hp(3),
          width: hp(6),
          backgroundColor: switchValue ? Colors.darkBlue : '#98A0A6',
          marginHorizontal: 5,
          borderRadius: hp(0.5),
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            height: hp(1.8),
            width: hp(2.2),
            backgroundColor: Colors.white,
            marginHorizontal: 3,
            borderRadius: hp(0.3),
            transform: [
              {
                translateX: switchValue ? hp(2.8) : hp(0.2),
              },
            ],
          }}
        />
      </Pressable>
    </View>
  );
};

export default Switch;
