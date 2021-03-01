import React from 'react';
import CustomModalAndroid from '../../../components/customModal';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import CheckBox from '../../../components/checkBox';
import FlatButton from '../../../components/flatButton';
import DatePicker from 'react-native-datepicker';
import Entypo from 'react-native-vector-icons/Entypo';

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{width: wp(56)}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  color: Colors.textLabelColor,
                  fontSize: wp(4),
                }}>
                Valid Until
              </Text>
              <View
                style={{
                  marginTop: hp(1),
                  marginBottom: hp(3),
                  borderWidth: 2,
                  // paddingHorizontal: 15,
                  borderRadius: 10,
                  height: hp(6.5),
                  borderColor: Colors.silver,
                  backgroundColor: Colors.white,
                }}>
                <DatePicker
                  style={{width: '100%'}}
                  date={new Date()}
                  mode="date"
                  placeholder="select date"
                  format="MM/yy"
                  minDate={new Date()}
                  // maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  iconComponent={
                    <Entypo
                      name={'calendar'}
                      size={25}
                      color={Colors.inputTextColor}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 7,
                        marginLeft: 0,
                      }}
                    />
                  }
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                      height: hp(6.5),
                      marginTop: 1,
                      ...STYLES.common,
                    },
                    dateText: {
                      fontSize: wp(4),
                      backgroundColor: Colors.textBG,
                      color: Colors.inputTextColor,
                      justifyContent: 'flex-start',
                    },
                  }}
                  onDateChange={(date) => {
                    // handleState('DOB', date);
                  }}
                />
              </View>
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
