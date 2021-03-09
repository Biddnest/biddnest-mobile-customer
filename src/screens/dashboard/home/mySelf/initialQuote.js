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
import DropDownAndroid from '../../../../components/dropDown';
import CheckBox from '../../../../components/checkBox';
import FlatButton from '../../../../components/flatButton';
import CloseIcon from '../../../../components/closeIcon';
import TwoButton from '../../../../components/twoButton';

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
        {[
          {
            title: 'Economy',
            price: '2,300',
            desc: 'Economy services includes moving only',
          },
          {
            title: 'Premium',
            price: '3,300',
            desc: 'Premium services includes Packing and Moving',
          },
        ].map((item, index) => {
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
                  {item.title}
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
                  Rs. {item.price}
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
                {item.desc}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TwoButton
        leftLabel={'Reject'}
        rightLabel={'Place order'}
        leftOnPress={() => setRejectVisible(true)}
        rightOnPress={props.handleBooking}
      />
      <CustomModalAndroid visible={rejectVisible}>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: Colors.inputTextColor,
            fontSize: wp(3.5),
          }}>
          REASON FOR REJECTION
        </Text>
        <CloseIcon
          onPress={() => setRejectVisible(false)}
          style={{
            position: 'absolute',
            right: 15,
            top: Platform.OS === 'android' ? -4 : -10,
          }}
        />
        <DropDownAndroid
          label={''}
          width={wp(90)}
          items={[{label: 'High Price', value: 'highprice'}]}
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
            marginBottom: hp(1.5),
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
