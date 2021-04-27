import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import {STYLES} from '../../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TwoButton from '../../../../components/twoButton';
import {useSelector} from 'react-redux';
import RejectBookingModal from '../../myBooking/rejectBookingModal';
import InformationPopUp from '../../../../components/informationPopUp';
import moment from 'moment';

const InitialQuote = (props) => {
  const {apiResponse} = props;
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
  const [economicInfo, setEconomicInfo] = useState(false);
  const [premiumInfo, setPremiumInfo] = useState(false);

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

  let estimation = apiResponse?.quote_estimate
    ? JSON.parse((apiResponse?.quote_estimate).toString())
    : {};
  let source_meta =
    (apiResponse?.source_meta &&
      JSON.parse(apiResponse?.source_meta?.toString())) ||
    {};
  let dateArray = [];
  apiResponse?.movement_dates?.forEach((item) => {
    dateArray.push(moment(item?.date).format('Do MMM'));
  });

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{flex: 1, marginBottom: hp(8)}}>
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
                      fontFamily: 'Gilroy-Bold',
                      fontSize: wp(4),
                      color: Colors.inputTextColor,
                      marginRight: 5,
                    }}>
                    {item.title}
                  </Text>
                  <Pressable
                    onPress={() => {
                      if (item.title === 'Economy') {
                        setEconomicInfo(true);
                      } else {
                        setPremiumInfo(true);
                      }
                    }}>
                    <Ionicons
                      name={'information-circle'}
                      size={25}
                      color={'#DEE6ED'}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    borderRadius: wp(15),
                    borderColor:
                      index === offerType ? Colors.btnBG : Colors.grey,
                    height: wp(30),
                    width: wp(30),
                    borderWidth: 3,
                    marginVertical: hp(2),
                    ...STYLES.common,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Gilroy-Bold',
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
        <View
          style={{
            width: wp(85),
            alignSelf: 'center',
          }}>
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>movement type</Text>
            <Text style={styles.rightText}>
              {source_meta?.shared_service ? 'Shared' : 'Dedicated'}
            </Text>
          </View>
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>Moving date</Text>
            <Text style={styles.rightText}>{dateArray.join('\n')}</Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          width: wp(100),
          bottom: 0,
        }}>
        <TwoButton
          isLoading={isLoading}
          leftLabel={'Reject'}
          rightLabel={'Place order'}
          leftOnPress={() => setRejectVisible(true)}
          rightOnPress={() =>
            props.handleBooking(offerType === 0 ? 'economic' : 'premium')
          }
        />
      </View>
      <RejectBookingModal
        value={rejectData?.reason}
        visible={rejectVisible}
        closeModal={() => setRejectVisible(false)}
        dropDownDefault={defaultReason}
        dropDownChange={(text) => setRejectData({...rejectData, reason: text})}
        textValue={rejectData?.desc}
        rejectData={rejectData}
        textOnChange={(text) => setRejectData({...rejectData, desc: text})}
        isLoading={isLoading}
        setLoading={(text) => setLoading(text)}
        public_booking_id={apiResponse?.public_booking_id}
        setApiResponse={props.setApiResponse}
        navigation={props}
      />
      <InformationPopUp
        visible={economicInfo || premiumInfo}
        title={economicInfo ? 'Economic Pricing' : 'Premium Pricing'}
        label={
          economicInfo
            ? 'Economic pricing only includes the cost of moving your items to the destination'
            : 'Premium pricing includes the cost of packaging and moving your items to the destination'
        }
        onCloseIcon={() => {
          if (economicInfo) {
            setEconomicInfo(false);
          } else {
            setPremiumInfo(false);
          }
        }}
      />
    </View>
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
    width: wp(44),
    alignItems: 'center',
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  leftText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
    textTransform: 'capitalize',
  },
  rightText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
  },
});
