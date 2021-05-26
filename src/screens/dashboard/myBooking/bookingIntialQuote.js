import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Linking,
  RefreshControl,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {STYLES} from '../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TwoButton from '../../../components/twoButton';
import {useSelector} from 'react-redux';
import RejectBookingModal from '../myBooking/rejectBookingModal';
import InformationPopUp from '../../../components/informationPopUp';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import Requirements from '../myBooking/requirements';
import MapModalAndroid from '../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import CloseIcon from '../../../components/closeIcon';
import FlatButton from '../../../components/flatButton';
import FinishFriends from '../../../assets/svg/finish_friends.svg';
import FinishMapPin from '../../../assets/svg/finish_map_pin.svg';
import FinishCalender from '../../../assets/svg/finish_calender.svg';
import FinishBed from '../../../assets/svg/finish_bed.svg';
import ActiveRs from '../../../assets/svg/active_rs.svg';
import InActiveRs from '../../../assets/svg/inactive_rs.svg';
import SimpleHeader from '../../../components/simpleHeader';
import {
  CustomAlert,
  CustomConsole,
  DiffMin,
  LoadingScreen,
} from '../../../constant/commonFun';
import LinearGradient from 'react-native-linear-gradient';
import LocationDistance from '../../../components/locationDistance';
import StepIndicator from 'react-native-step-indicator';
import {APICall, getOrderDetails} from '../../../redux/actions/user';
import {STORE} from '../../../redux';

const BookingInitialQuote = (props) => {
  const [orderData, setOrderData] = useState(
    props?.route?.params?.orderData || {},
  );
  console.log(orderData);
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
          latitude: parseFloat(orderData?.source_lat),

          longitude: parseFloat(orderData?.source_lng),
        }
      : {
          latitude: parseFloat(orderData?.destination_lat),
          longitude: parseFloat(orderData?.destination_lng),
        };

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

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    setLoading(true);
    if (orderData?.public_booking_id) {
      getOrderDetails(orderData?.public_booking_id)
        .then((res) => {
          if (res?.data?.status === 'success') {
            let temp = res?.data?.data?.booking;
            if (temp?.status === 4) {
              props.navigation.replace('FinalQuote', {orderData: temp});
            } else if (
              temp?.status === 5 ||
              temp?.status === 6 ||
              temp?.status === 7 ||
              temp?.status === 8
            ) {
              props.navigation.replace('OrderTracking', {orderData: temp});
            }
            setOrderData(res?.data?.data?.booking);
          } else {
            CustomAlert(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          CustomConsole(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  let estimation = orderData?.quote_estimate
    ? JSON.parse((orderData?.quote_estimate).toString())
    : {};
  let source_meta =
    (orderData?.source_meta &&
      JSON.parse(orderData?.source_meta?.toString())) ||
    {};
  let destination_meta =
    (orderData?.destination_meta &&
      JSON.parse(orderData?.destination_meta?.toString())) ||
    {};
  let dateArray = [];
  orderData?.movement_dates?.forEach((item) => {
    dateArray.push(moment(item?.date).format('Do MMM'));
  });
  let meta = JSON.parse(orderData?.meta?.toString()) || {};

  const renderFriends = (stepStatus) => {
    return <FinishFriends width={hp(9)} height={hp(9)} />;
  };
  const renderMapPin = (stepStatus) => {
    return <FinishMapPin width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderCalender = (stepStatus) => {
    return <FinishCalender width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderBed = (stepStatus) => {
    return <FinishBed width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderRS = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveRs width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return null;
    } else {
      return <InActiveRs width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number,
    stepStatus: string,
  }) => {
    switch (position) {
      case 0:
        if (!meta?.self_booking) {
          return renderFriends(stepStatus);
        }
        return renderMapPin(stepStatus);
      case 1:
        if (!meta?.self_booking) {
          return renderMapPin(stepStatus);
        }
        return renderCalender(stepStatus);
      case 2:
        if (!meta?.self_booking) {
          return renderCalender(stepStatus);
        }
        return renderBed(stepStatus);
      case 3:
        if (!meta?.self_booking) {
          return renderBed(stepStatus);
        }
        return renderRS(stepStatus);
      case 4:
        if (!meta?.self_booking) {
          return renderRS(stepStatus);
        }
        return null;
      default: {
        break;
      }
    }
  };
  const renderStepIndicator = (params: any) =>
    getStepIndicatorIconConfig(params);

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

  const renderRightDate = (dates) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '50%',
          justifyContent: 'flex-end',
        }}>
        {dates?.map((item, index) => {
          return (
            <View style={styles.categoryView} key={index}>
              <Text
                style={{
                  color: Colors.inputTextColor,
                  fontSize: wp(3.8),
                  fontFamily: 'Roboto-Bold',
                }}>
                {item}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const handleBooking = (service_type) => {
    //Accept order
    let obj = {
      url: 'bookings/confirm',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
      data: {
        service_type: service_type,
        public_booking_id: orderData?.public_booking_id,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          props.navigation.replace('OrderTimer', {orderData: orderData});
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader
        headerText={'Order Tracking'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getData} />
        }
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
        <LinearGradient
          colors={[Colors.pageBG, Colors.white]}
          style={{flex: 1}}>
          <LocationDistance
            from={
              source_meta?.city === destination_meta?.city
                ? source_meta?.address
                : source_meta?.city
            }
            to={
              source_meta?.city === destination_meta?.city
                ? destination_meta?.address
                : destination_meta?.city
            }
            finalDistance={meta?.distance}
          />
          <View style={{paddingVertical: hp(2)}}>
            <StepIndicator
              stepCount={meta?.self_booking ? 4 : 5}
              customStyles={STYLES.stepperStyle}
              currentPosition={meta?.self_booking ? 3 : 4}
              renderStepIndicator={renderStepIndicator}
            />
          </View>
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
                      color:
                        selectedTab === index ? Colors.darkBlue : '#ACABCD',
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
                  <Feather
                    name={'map-pin'}
                    color={Colors.darkBlue}
                    size={wp(7)}
                  />
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
                style={[
                  STYLES.separatorView,
                  {width: '90%', alignSelf: 'center'},
                ]}
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
                  <Feather
                    name={'map-pin'}
                    color={Colors.darkBlue}
                    size={wp(7)}
                  />
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
                  {renderText(
                    'Lift',
                    destination_meta?.lift == 1 ? 'Yes' : 'No',
                  )}
                </View>
              </View>
            </ScrollView>
          )}
          {selectedTab === 1 && (
            <Requirements
              navigation={props.navigation}
              orderDetails={orderData}
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
                    marginTop: hp(2),
                  }}>
                  Please note that this is the baseline price, you will be
                  receiving the Vendor bid list with the final quotations
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
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
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
                    <Text style={styles.leftText}>Booking For</Text>
                    <Text style={styles.rightText}>
                      {meta?.self_booking ? 'MySelf' : 'Others'}
                    </Text>
                  </View>
                  <View style={styles.flexBox}>
                    <Text style={styles.leftText}>Moving date</Text>
                    {renderRightDate(dateArray)}
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
                    handleBooking(offerType === 0 ? 'economic' : 'premium')
                  }
                />
              </View>
            </View>
          )}
          <RejectBookingModal
            value={rejectData?.reason}
            visible={rejectVisible}
            closeModal={() => setRejectVisible(false)}
            dropDownDefault={defaultReason}
            dropDownChange={(text) =>
              setRejectData({...rejectData, reason: text})
            }
            textValue={rejectData?.desc}
            rejectData={rejectData}
            textOnChange={(text) => setRejectData({...rejectData, desc: text})}
            isLoading={isLoading}
            setLoading={(text) => setLoading(text)}
            public_booking_id={orderData?.public_booking_id}
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
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

export default BookingInitialQuote;

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
  categoryView: {
    marginBottom: hp(0.8),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: Colors.darkBlue,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginLeft: hp(1.3),
  },
});
