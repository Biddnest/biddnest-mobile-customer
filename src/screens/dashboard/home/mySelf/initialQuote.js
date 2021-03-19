import React, {useEffect, useState} from 'react';
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
import {STORE} from '../../../../redux';
import {APICall} from '../../../../redux/actions/user';
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
} from '../../../../constant/commonFun';
import {useSelector} from 'react-redux';
import RejectBookingModal from '../../myBooking/rejectBookingModal';

const InitialQuote = (props) => {
  const configData =
    useSelector((state) => state.Login?.configData?.keys) || {};
  const [offerType, setOfferType] = useState(0);
  const [rejectData, setRejectData] = useState({
    reason: '',
    desc: '',
  });
  const [defaultReason, setDefaultReason] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);

  useEffect(() => {
    let temp = [];
    configData.cancellation_reason_options.forEach((item) => {
      temp.push({
        label: item,
        value: item,
      });
    });
    setRejectData({
      ...rejectData,
      reason: configData?.cancellation_reason_options[0],
    });
    setDefaultReason(temp);
  }, [configData]);

  let estimation = props?.apiResponse?.quote_estimate
    ? JSON.parse((props?.apiResponse?.quote_estimate).toString())
    : {};
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
            price: estimation?.economic,
            desc: 'Economy services includes moving only',
          },
          {
            title: 'Premium',
            price: estimation?.premium,
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
        rightOnPress={() =>
          props.handleBooking(offerType === 0 ? 'economic' : 'premium')
        }
      />
      <RejectBookingModal
        visible={rejectVisible}
        closeModal={() => setRejectVisible(false)}
        dropDownDefault={defaultReason}
        dropDownChange={(text) => setRejectData({...rejectData, reason: text})}
        textValue={rejectData?.desc}
        rejectData={rejectData}
        textOnChange={(text) => setRejectData({...rejectData, desc: text})}
        isLoading={isLoading}
        setLoading={(text) => setLoading(text)}
        public_booking_id={props?.apiResponse?.public_booking_id}
        setApiResponse={props.setApiResponse}
        navigation={props}
      />
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
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
