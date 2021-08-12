import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Pressable,
  RefreshControl,
  Linking,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {STYLES} from '../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/button';
import HomeCall from '../../../assets/svg/home_call.svg';
import EmailCall from '../../../assets/svg/email_call.svg';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import moment from 'moment';
import {useSelector} from 'react-redux';
import MapPin from '../../../assets/svg/map_pin.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ContactUs = (props) => {
  const [recentTicket, setRecentTicket] = useState([]);
  const [recentOrder, setRecentOrder] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [requestCallBackLoading, setRequestCallBackLoading] = useState(false);
  const [contactUs, setContactUs] = useState({});
  const ticketStatus =
    useSelector((state) => state.Login?.configData?.enums?.ticket?.status) ||
    {};
  useEffect(() => {
    fetchTicket();
    let obj = {
      url: 'bookings/recent',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setRecentOrder(res?.data?.data?.booking);
        } else {
          // CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
    let obj1 = {
      url: 'contact-us',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj1)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setContactUs(res?.data?.data?.details);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  }, []);
  const fetchTicket = () => {
    let obj = {
      url: 'tickets',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setRecentTicket(res?.data?.data?.ticket);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  };
  const renderItem = ({item, index}) => {
    let status = '';
    Object.values(ticketStatus).forEach((i, ind) => {
      if (i === item.status) {
        status = Object.keys(ticketStatus)[ind];
      }
    });
    return (
      <Pressable
        key={index}
        onPress={() =>
          props.navigation.navigate('SingleTicket', {
            ticket: {id: item?.id},
          })
        }>
        {item?.meta && JSON.parse(item?.meta?.toString())?.public_booking_id && (
          <View style={styles.flexBox}>
            <Text
              style={{
                ...styles.locationText,
                marginTop: 0,
                fontSize: wp(3.8),
                fontFamily: 'Roboto-Medium',
                width: '30%',
              }}>
              ORDER ID
            </Text>
            <View
              style={{
                height: hp(3.5),
                ...STYLES.common,
              }}>
              <Text
                style={{
                  color: Colors.inputTextColor,
                  fontSize: wp(3.8),
                  fontFamily: 'Gilroy-SemiBold',
                  textTransform: 'uppercase',
                }}>
                {item?.meta &&
                  JSON.parse(item?.meta?.toString())?.public_booking_id}
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.flexBox,
            {
              marginTop: hp(0.5),
            },
          ]}>
          <Text
            style={{
              ...styles.locationText,
              marginTop: 0,
              fontSize: wp(3.8),
              fontFamily: 'Roboto-Medium',
              width: '70%',
            }}>
            {item?.heading}
            {/*<Text*/}
            {/*  style={{*/}
            {/*    fontFamily: 'Roboto-Bold',*/}
            {/*  }}>*/}
            {/*  #123456*/}
            {/*</Text>*/}
          </Text>
          <View
            style={{
              backgroundColor:
                ticketStatus?.open === item?.status
                  ? Colors.btnBG
                  : ticketStatus?.resolved === item?.status
                  ? Colors.lightGreen
                  : Colors.error,
              borderRadius: hp(2),
              paddingHorizontal: wp(3),
              paddingVertical: hp(1),
              ...STYLES.common,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: wp(3.8),
                fontFamily: 'Gilroy-SemiBold',
                textTransform: 'capitalize',
              }}>
              {status}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.flexBox,
            marginTop: hp(1),
          }}>
          <Text
            style={[
              styles.locationText,
              {
                fontFamily: 'Roboto-Light',
                fontSize: wp(3.8),
              },
            ]}>
            {item?.desc}
          </Text>
        </View>
        <Text
          style={{
            ...styles.locationText,
            marginTop: 0,
            fontFamily: 'Roboto-Light',
            fontSize: wp(3.8),
            textAlign: 'right',
          }}>
          {moment(item?.created_at).format('D MMM')}
        </Text>
      </Pressable>
    );
  };
  let source_meta =
    (recentOrder?.source_meta &&
      JSON.parse(recentOrder?.source_meta?.toString())) ||
    {};
  let destination_meta =
    (recentOrder?.destination_meta &&
      JSON.parse(recentOrder?.destination_meta?.toString())) ||
    {};
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'Contact Us'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchTicket} />
        }
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {destination_meta?.city && (
          <View style={styles.inputForm}>
            <Text style={styles.headerText}>recent order</Text>
            <View style={styles.separatorView} />
            <View
              style={{
                backgroundColor: Colors.white,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MapPin height={hp(6.5)} width={wp(5)} />
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 5,
                }}>
                <View style={{width: '85%'}}>
                  <View style={[styles.flexBox, {width: wp(70)}]}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.locationText,
                        marginTop: 0,
                        textTransform: 'capitalize',
                        maxWidth: '80%',
                        fontFamily: 'Gilroy-SemiBold',
                      }}>
                      {source_meta?.city === destination_meta?.city
                        ? source_meta?.address
                        : source_meta?.city}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.flexBox,
                      marginTop: hp(1.5),
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.locationText,
                        {
                          textTransform: 'capitalize',
                          maxWidth: '80%',
                          fontFamily: 'Gilroy-SemiBold',
                        },
                      ]}>
                      {destination_meta?.city === source_meta?.city
                        ? destination_meta?.address
                        : destination_meta?.city}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    if (recentOrder?.status === 0) {
                      props.navigation.navigate('BookingInitialQuote', {
                        orderData: recentOrder,
                      });
                    } else if (
                      recentOrder?.status === 2 ||
                      recentOrder?.status === 3
                    ) {
                      props.navigation.navigate('OrderTimer', {
                        orderData: recentOrder,
                      });
                    } else if (recentOrder?.status === 4) {
                      props.navigation.navigate('FinalQuote', {
                        orderData: recentOrder,
                      });
                    } else if (
                      recentOrder?.status === 5 ||
                      recentOrder?.status === 6 ||
                      recentOrder?.status === 7 ||
                      recentOrder?.status === 8
                    ) {
                      props.navigation.navigate('OrderTracking', {
                        orderData: recentOrder,
                      });
                    }
                  }}
                  style={{
                    height: hp(7),
                    width: hp(7),
                    borderRadius: hp(3.5),
                    backgroundColor: '#F2E6FF',
                    alignSelf: 'center',
                    ...STYLES.common,
                  }}>
                  <AntDesign
                    name={'link'}
                    color={Colors.darkBlue}
                    size={wp(5)}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        <View style={styles.assistantView}>
          <Text style={styles.headerText}>NEED ASSISTANCE?</Text>
          <View style={styles.separatorView} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.locationText,
                {
                  fontSize: wp(3.8),
                  lineHeight: hp(2.7),
                },
              ]}>
              Call us at{'\n'}
              <Text
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                }}>
                {contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]}
                {contactUs?.contact_no?.length > 1 &&
                  ', ' + contactUs.contact_no[1]}
              </Text>
            </Text>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `tel:${
                    contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]
                  }`,
                )
              }>
              <HomeCall width={hp(7)} height={hp(7)} />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              marginTop: hp(1.5),
            }}>
            <Text
              style={[
                styles.locationText,
                {
                  fontSize: wp(3.8),
                  lineHeight: hp(2.7),
                },
              ]}>
              Email us at{'\n'}
              <Text
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                }}>
                {contactUs?.email_id?.length > 0 && contactUs.email_id[0]}
                {contactUs?.email_id?.length > 1 &&
                  ', \n' + contactUs.email_id[1]}{' '}
              </Text>
            </Text>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `mailto:${
                    contactUs?.email_id?.length > 0 && contactUs.email_id[0]
                  }`,
                )
              }>
              <EmailCall width={hp(7)} height={hp(7)} />
            </Pressable>
          </View>
        </View>
        {recentTicket.length > 0 && (
          // recentTicket?.status > 4 &&
          // recentTicket?.status < 8 &&
          <View style={styles.inputForm}>
            <Text style={styles.headerText}>RECENT TICKETS</Text>
            <View style={styles.separatorView} />
            <View>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={recentTicket || []}
                renderItem={renderItem}
                ItemSeparatorComponent={() => (
                  <View style={styles.separatorView} />
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <View style={{alignSelf: 'center'}}>
        <Button
          width={wp(90)}
          backgroundColor={Colors.white}
          label={'RAISE SERVICE REQUEST'}
          spaceBottom={0.1}
          onPress={() => props.navigation.navigate('RaiseTicket')}
        />
        <Button
          isLoading={requestCallBackLoading}
          label={'REQUEST A CALL BACK'}
          onPress={() => {
            // call Request a call back api
            props.navigation.navigate('RaiseTicket', {
              public_booking_id: null,
              category: 4,
            });
            // setRequestCallBackLoading(true);
            // let obj = {
            //   url: 'tickets/callback',
            //   method: 'post',
            //   headers: {
            //     Authorization:
            //       'Bearer ' + STORE.getState().Login?.loginData?.token,
            //   },
            // };
            // APICall(obj)
            //   .then((res) => {
            //     setRequestCallBackLoading(false);
            //     CustomAlert('Request a Call Back Successfully');
            //   })
            //   .catch((err) => {
            //     setRequestCallBackLoading(false);
            //     CustomConsole(err);
            //   });
          }}
          spaceBottom={0}
          width={wp(90)}
        />
      </View>
    </LinearGradient>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: wp(5),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  locationText: {
    fontFamily: 'Gilroy-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    textTransform: 'uppercase',
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
    textAlign: 'center',
    marginTop: hp(1),
  },
  assistantView: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: wp(5),
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
  },
});
