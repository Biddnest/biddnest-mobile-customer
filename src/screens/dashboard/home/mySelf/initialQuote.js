import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import {STYLES} from '../../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TwoButton from '../../../../components/twoButton';
import {useSelector} from 'react-redux';
import RejectBookingModal from '../../myBooking/rejectBookingModal';
import InformationPopUp from '../../../../components/informationPopUp';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import Requirements from '../../myBooking/requirements';
import MapModalAndroid from '../../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import CloseIcon from '../../../../components/closeIcon';
import FlatButton from '../../../../components/flatButton';

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
  const [tab, setTab] = useState(['Order Details', 'Requirements', 'My Bid']);
  const [selectedTab, setSelectedTab] = useState(2);
  const [mapVisible, setMapVisible] = useState(null);
  let coordinates =
    mapVisible === 'pickup'
      ? {
          latitude: parseFloat(apiResponse?.source_lat),

          longitude: parseFloat(apiResponse?.source_lng),
        }
      : {
          latitude: parseFloat(apiResponse?.destination_lat),
          longitude: parseFloat(apiResponse?.destination_lng),
        };

  console.log(apiResponse);

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
  let destination_meta =
    (apiResponse?.destination_meta &&
      JSON.parse(apiResponse?.destination_meta?.toString())) ||
    {};
  let dateArray = [];
  apiResponse?.movement_dates?.forEach((item) => {
    dateArray.push(moment(item?.date).format('Do MMM'));
  });
  let meta = JSON.parse(apiResponse?.meta);

  const renderText = (key, value) => {
    return (
      <View>
        <Text style={STYLES.staticLabel}>{key}</Text>
        <Text
          style={[
            STYLES.staticLabel,
            {
              fontFamily: 'Roboto-Regular',
              marginTop: 5,
            },
          ]}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={STYLES.tabView}>
        {tab.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={{
                ...STYLES.common,
                borderColor:
                  selectedTab === index ? Colors.darkBlue : '#ACABCD',
                borderBottomWidth: selectedTab === index ? 2 : 0,
              }}
              onPress={() => setSelectedTab(index)}>
              <Text
                style={{
                  ...STYLES.tabText,
                  color: selectedTab === index ? Colors.darkBlue : '#ACABCD',
                }}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selectedTab === 0 && (
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '80%'}}>
              {renderText('Pickup Address', source_meta?.address)}
            </View>
            <Pressable
              style={STYLES.mapPinCircle}
              onPress={() => setMapVisible('pickup')}>
              <Feather name={'map-pin'} color={Colors.darkBlue} size={wp(7)} />
            </Pressable>
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
            }}>
            {renderText('Pincode', source_meta?.pincode)}
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              {renderText('Floor', source_meta?.floor)}
            </View>
            <View style={{flex: 1}}>
              {renderText('Lift', source_meta?.lift == 1 ? 'Yes' : 'No')}
            </View>
          </View>
          <View
            style={[STYLES.separatorView, {width: '90%', alignSelf: 'center'}]}
          />
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '80%'}}>
              {renderText('Drop Address', destination_meta?.address)}
            </View>
            <Pressable
              style={STYLES.mapPinCircle}
              onPress={() => setMapVisible('drop')}>
              <Feather name={'map-pin'} color={Colors.darkBlue} size={wp(7)} />
            </Pressable>
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
            }}>
            {renderText('Pincode', destination_meta?.pincode)}
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              {renderText('Floor', destination_meta?.floor)}
            </View>
            <View style={{flex: 1}}>
              {renderText('Lift', destination_meta?.lift == 1 ? 'Yes' : 'No')}
            </View>
          </View>
        </ScrollView>
      )}
      {selectedTab === 1 && (
        <Requirements
          navigation={props.navigation}
          orderDetails={apiResponse}
        />
      )}
      {selectedTab === 2 && (
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
                marginTop: hp(2)
              }}>
              Please note that this is the baseline price, you will be receiving
              the Vendor bid list with the final quotations
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
                          size={hp(3.5)}
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
                <Text style={styles.leftText}>order type</Text>
                <Text style={styles.rightText}>
                  {meta?.self_booking ? 'My Self' : 'Others'}
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
        </View>
      )}
      <MapModalAndroid
        visible={mapVisible !== null}
        onPress={() => setMapVisible(null)}>
        <View style={styles.mapView}>
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            style={{flex: 1}}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={coordinates} />
          </MapView>
        </View>
        <CloseIcon
          onPress={() => setMapVisible(null)}
          style={[
            {
              position: 'absolute',
              right: hp(2),
              top: hp(2),
              height: hp(5),
              width: hp(5),
              borderRadius: hp(2.5),
              zIndex: 5000,
              backgroundColor: Colors.white,
              ...STYLES.common,
            },
          ]}
        />
        <View style={{marginVertical: hp(3), width: wp(90)}}>
          {renderText(
            mapVisible === 'pickup' ? 'Pickup Address' : 'Drop Address',
            mapVisible === 'pickup'
              ? source_meta?.address
              : destination_meta?.address,
          )}
        </View>
        <View style={{marginTop: hp(1)}}>
          <FlatButton
            label={'open in maps app'}
            onPress={() => {
              let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
              Linking.openURL(
                scheme + `${coordinates.latitude},${coordinates.longitude}`,
              );
            }}
          />
        </View>
      </MapModalAndroid>
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
  mapView: {
    height: hp(67),
    width: wp(100),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
});
