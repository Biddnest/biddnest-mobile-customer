import React from 'react';
import {Text} from 'react-native';
import {STYLES} from '../constant/commonStyle';
import TwoButton from './twoButton';
import CustomModalAndroid from './customModal';

const BackConfirmation = (props) => {
  const {visible, closeIcon, text, navigation} = props;
  return (
    <CustomModalAndroid
      visible={visible}
      onPress={closeIcon}
      title={'CONFIRMATION'}>
      <Text style={STYLES.simpleText}>{text}</Text>
      <TwoButton
        leftLabel={'cancel'}
        rightLabel={'ok'}
        leftOnPress={closeIcon}
        rightOnPress={() => {
          closeIcon();
          navigation.goBack();
        }}
      />
    </CustomModalAndroid>
  );
};

export default BackConfirmation;
