import React from 'react';
import {Text} from 'react-native';
import {STYLES} from '../constant/commonStyle';
import TwoButton from './twoButton';
import CustomModalAndroid from './customModal';
import {trackUserData} from '../redux/actions/user';

const BackConfirmation = (props) => {
  const {visible, closeIcon, text, navigation, data} = props;
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
          if (data?.source?.meta?.geocode !== '') {
            trackUserData(data);
          }
          closeIcon();
          navigation.goBack();
        }}
      />
    </CustomModalAndroid>
  );
};

export default BackConfirmation;
