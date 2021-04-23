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
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import moment from 'moment';
import {useSelector} from 'react-redux';

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
          CustomAlert(res?.data?.message);
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
        <View style={styles.flexBox}>
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
                ticketStatus?.open === item?.status ||
                ticketStatus?.resolved === item?.status
                  ? Colors.lightGreen
                  : Colors.error,
              height: hp(3.5),
              borderRadius: hp(2),
              paddingHorizontal: wp(3),
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
              }}>
              <Image
                source={require('../../../assets/images/pin_distance.png')}
                style={{height: wp(15), width: wp(10)}}
                resizeMode={'contain'}
              />
              <View
                style={{
                  width: '87%',
                  flexDirection: 'row',
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
                        fontFamily: 'Roboto-SemiBold',
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
                          fontFamily: 'Roboto-SemiBold',
                        },
                      ]}>
                      {destination_meta?.city === source_meta?.city
                        ? destination_meta?.address
                        : destination_meta?.city}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: wp(10),
                    width: wp(10),
                    borderRadius: wp(5),
                    backgroundColor: '#F2E6FF',
                    alignSelf: 'center',
                    ...STYLES.common,
                  }}>
                  <Ionicons
                    name={'call'}
                    color={Colors.darkBlue}
                    size={wp(5)}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        {recentTicket.length > 0 && (
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
        <View style={styles.assistantView}>
          <View>
            <Text
              style={{
                ...styles.locationText,
                marginTop: 0,
                fontSize: wp(3.8),
                fontFamily: 'Roboto-Medium',
              }}>
              NEED ASSISTANCE?
            </Text>
            <Text
              style={[
                styles.locationText,
                {
                  fontSize: wp(3.8),
                  marginTop: hp(1),
                },
              ]}>
              Call us at{' '}
              <Text
                style={{
                  fontFamily: 'Gilroy-Bold',
                }}>
                {contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]}{' '}
                {contactUs?.contact_no?.length > 1 &&
                  'Or \n' + contactUs.contact_no[1]}
              </Text>
            </Text>
            <Text
              style={[
                styles.locationText,
                {
                  fontSize: wp(3.8),
                  marginTop: hp(0.5),
                },
              ]}>
              Email us at{' '}
              <Text
                style={{
                  fontFamily: 'Gilroy-Bold',
                }}>
                {contactUs?.email_id?.length > 0 && contactUs.email_id[0]}{' '}
                {contactUs?.email_id?.length > 1 &&
                  'Or \n' + contactUs.email_id[1]}{' '}
              </Text>
            </Text>
          </View>
          <Pressable
            onPress={() =>
              Linking.openURL(
                `tel:${
                  contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]
                }`,
              )
            }>
            <HomeCall width={55} height={55} />
          </Pressable>
        </View>
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
              setRequestCallBackLoading(true);
              let obj = {
                url: 'tickets/callback',
                method: 'post',
                headers: {
                  Authorization:
                    'Bearer ' + STORE.getState().Login?.loginData?.token,
                },
              };
              APICall(obj)
                .then((res) => {
                  setRequestCallBackLoading(false);
                  CustomAlert('Request a Call Back Successfully');
                })
                .catch((err) => {
                  setRequestCallBackLoading(false);
                  CustomConsole(err);
                });
            }}
            spaceBottom={0}
            width={wp(90)}
          />
        </View>
      </ScrollView>
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
    fontSize: wp(4.5),
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(92),
    alignSelf: 'center',
  },
});
