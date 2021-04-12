import React, {useEffect, useState} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {Colors, wp} from '../constant/colors';

const Switch = (props) => {
  const [switchValue, setSwitchValue] = useState(props.value != 0);

  useEffect(() => {
    setSwitchValue(props.value != 0);
  }, [props.value]);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Pressable
        onPress={() => props.onChange(props.value == 0 ? 1 : 0)}
        style={{
          height: 24,
          width: 45,
          backgroundColor: switchValue ? Colors.darkBlue : '#98A0A6',
          marginHorizontal: 5,
          borderRadius: 3,
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            height: 15,
            width: 17,
            backgroundColor: Colors.white,
            marginHorizontal: 3,
            borderRadius: 2,
            transform: [
              {
                translateX: switchValue ? 20 : 2,
              },
            ],
          }}
        />
      </Pressable>
    </View>
  );
};

export default Switch;
