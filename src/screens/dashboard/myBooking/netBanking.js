import React from 'react';
import CustomModalAndroid from '../../../components/customModal';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import FlatButton from '../../../components/flatButton';
import DropDownAndroid from '../../../components/dropDown';

const NetBanking = (props) => {
  return (
    <CustomModalAndroid visible={props.visible}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Roboto-Regular',
              color: Colors.inputTextColor,
            }}>
            NET BANKING
          </Text>
          <CloseIcon onPress={props.onCloseIcon} />
        </View>
        <View style={{...styles.separatorView, width: '85%'}} />
        <View style={{marginBottom: hp(5)}}>
          <DropDownAndroid
            width={wp(90)}
            label={'Bank'}
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            onChangeItem={(text) => {}}
          />
        </View>
        <FlatButton label={'SUBMIT'} />
      </View>
    </CustomModalAndroid>
  );
};

export default NetBanking;

const styles = StyleSheet.create({
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  mainText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
    marginTop: hp(1),
  },
});
