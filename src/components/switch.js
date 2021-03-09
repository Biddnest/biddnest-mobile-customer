import React, {useState} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {Colors, wp} from '../constant/colors';

const Switch = (props) => {
  const [switchValue, setSwitchValue] = useState(false);

  const clicked = () => {
    setSwitchValue(!switchValue);
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: !switchValue ? '#3B4B58' : '#99A0A5',
          fontSize: wp(3.8),
        }}>
        No
      </Text>
      <Pressable
        onPress={() => clicked()}
        style={{
          height: 20,
          width: 45,
          backgroundColor: switchValue ? Colors.darkBlue : '#98A0A6',
          marginHorizontal: 5,
          borderRadius: 5,
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            height: 13,
            width: 17,
            backgroundColor: Colors.white,
            marginHorizontal: 3,
            borderRadius: 5,
            transform: [
              {
                translateX: switchValue ? 21 : 0,
              },
            ],
          }}
        />
      </Pressable>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: switchValue ? '#3B4B58' : '#99A0A5',
          fontSize: wp(3.8),
        }}>
        Yes
      </Text>
    </View>
  );
};

export default Switch;
