import React from 'react';
import CustomModalAndroid from '../../../components/customModal';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import CheckBox from '../../../components/checkBox';
import FlatButton from '../../../components/flatButton';

const AddNewCard = (props) => {
  const [isAgree, setAgree] = React.useState(true);
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
            CARD DETAILS
          </Text>
          <CloseIcon onPress={props.onCloseIcon} />
        </View>
        <View style={{...styles.separatorView, width: '85%'}} />
        <View style={{width: wp(90)}}>
          <TextInput
            label={'Card Number'}
            placeHolder={'XXXX XXXX XXXX 2323'}
            onChange={(text) => {}}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: wp(60)}}>
              <TextInput
                label={'Valid Until'}
                placeHolder={'Valid Until'}
                onChange={(text) => {}}
              />
            </View>
            <View style={{width: wp(30)}}>
              <TextInput
                label={'CVV'}
                placeHolder={'111'}
                onChange={(text) => {}}
              />
            </View>
          </View>
          <TextInput
            label={'Card Holder Name'}
            placeHolder={'Card Holder Name'}
            onChange={(text) => {}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: wp(3),
            }}>
            <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
            <Text
              style={{
                color: Colors.grey,
                fontSize: wp(3.8),
              }}>
              Save this card for future use
            </Text>
          </View>
        </View>
        <FlatButton label={'SUBMIT'} />
      </View>
    </CustomModalAndroid>
  );
};

export default AddNewCard;

const styles = StyleSheet.create({
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
});
