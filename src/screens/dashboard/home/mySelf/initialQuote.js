import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {STYLES} from '../../../../constant/commonStyle';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModalAndroid from '../../../../components/customModal';
import DropDown from '../../../../components/dropDown';
import CheckBox from '../../../../components/checkBox';
import FlatButton from '../../../../components/flatButton';
import CloseIcon from '../../../../components/closeIcon';

const InitialQuote = (props) => {
  const [offerType, setOfferType] = useState(0);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [isAgree, setAgree] = useState(true);

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Text
        style={{
          fontFamily: 'Roboto-Italic',
          fontSize: wp(3.5),
          color: '#99A0A5',
          textAlign: 'center',
          marginHorizontal: wp(6),
        }}>
        Please note that this is the baseline price, you will be receiving the
        Vendor bid list with the final quotations
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: wp(5),
          justifyContent: 'space-between',
        }}>
        {[1, 2].map((item, index) => {
          return (
            <Pressable
              key={index}
              style={styles.inputForm}
              onPress={() => setOfferType(index)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4),
                    color: Colors.inputTextColor,
                    marginRight: 5,
                  }}>
                  Economy
                </Text>
                <Ionicons
                  name={'information-circle'}
                  size={25}
                  color={'#DEE6ED'}
                />
              </View>
              <View
                style={{
                  borderRadius: wp(15),
                  borderColor: index === offerType ? Colors.btnBG : Colors.grey,
                  height: wp(30),
                  width: wp(30),
                  borderWidth: 3,
                  marginVertical: hp(2),
                  ...STYLES.common,
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4.7),
                    color:
                      index === offerType
                        ? Colors.btnBG
                        : Colors.inputTextColor,
                  }}>
                  Rs. 2,300
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Light',
                    fontSize: wp(4),
                    color:
                      index === offerType
                        ? Colors.btnBG
                        : Colors.inputTextColor,
                    marginTop: 5,
                  }}>
                  Base price
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Roboto-Italic',
                  fontSize: wp(3.5),
                  color: '#99A0A5',
                  textAlign: 'center',
                }}>
                Economy services includes moving only
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'PLACE ORDER'}
          onPress={() => props.handleBooking()}
          spaceBottom={0}
          width={wp(90)}
        />
        <Button
          width={wp(90)}
          backgroundColor={Colors.white}
          label={'REJECT'}
          spaceTop={hp(0.1)}
          onPress={() => setRejectVisible(true)}
        />
      </View>
      <CustomModalAndroid visible={rejectVisible}>
        <CloseIcon
          onPress={() => setRejectVisible(false)}
          style={{
            position: 'absolute',
            right: 15,
            top: Platform.OS === 'android' ? 0 : -10,
          }}
        />
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: Colors.inputTextColor,
            fontSize: wp(3.5),
          }}>
          REASON FOR REJECTION
        </Text>
        <DropDown
          label={''}
          width={wp(90)}
          items={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
          ]}
          onChangeItem={(text) => {}}
        />
        <View style={{width: wp(90)}}>
          <TextInput
            label={''}
            placeHolder={'Enter your expected price here'}
            numberOfLines={4}
            onChange={(text) => {}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: Colors.inputTextColor,
              fontSize: wp(3.8),
            }}>
            Talk to our agent
          </Text>
        </View>
        <FlatButton label={'CANCEL BOOKING'} />
      </CustomModalAndroid>
    </ScrollView>
  );
};

export default InitialQuote;

const styles = StyleSheet.create({
  inputForm: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
    width: wp(42),
    alignItems: 'center',
  },
  arrowView: {
    height: hp(6.5),
    width: hp(6.5),
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.btnBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: hp(60),
    width: wp(100),
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
