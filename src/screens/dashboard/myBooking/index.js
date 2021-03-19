import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {HomeHeader} from '../home';
import {STYLES} from '../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {getLiveOrders, getPastOrders} from '../../../redux/actions/user';
import {getDistance} from 'geolib';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';
import moment from 'moment';

const MyBooking = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.booking) || {};
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const [liveOrders, setLiveOrders] = useState(
    useSelector((state) => state.Login?.liveOrders?.booking) || [],
  );
  const [pastOrders, setPastOrders] = useState(
    useSelector((state) => state.Login?.pastOrders?.booking) || [],
  );
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    if (isFocused && userData?.fname) {
      dispatch(getLiveOrders())
        .then((res) => {
          if (res?.status === 'success') {
            setLiveOrders(res?.data?.booking);
          } else {
            CustomAlert(res?.message);
          }
        })
        .catch((err) => {
          CustomConsole(err);
        });
      dispatch(getPastOrders())
        .then((res) => {
          if (res?.status === 'success') {
            setPastOrders(res?.data?.booking);
          } else {
            CustomAlert(res?.message);
          }
        })
        .catch((err) => {
          CustomConsole(err);
        });
    }
  }, [isFocused]);

  const handleOrderClicked = (item) => {
    props.navigation.navigate('OrderTracking', {orderData: item});
    // props.navigation.navigate('Payment', {orderData: item});
    // props.navigation.navigate('FinalQuote', {orderData: item});
  };
  const renderItem = ({item, index}) => {
    let ind = Object.values(configData?.status).findIndex(
      (ele) => ele === item?.status,
    );
    let status = Object.keys(configData?.status)[ind];
    let source_meta = JSON.parse(item?.source_meta?.toString()) || {};
    let destination_meta = JSON.parse(item?.destination_meta?.toString()) || {};
    let meta = JSON.parse(item?.meta?.toString()) || {};
    let dateArray = [];
    item?.movement_dates.forEach((i) => {
      dateArray.push(moment(i.date).format('D MMM yyyy'));
    });
    return (
      <Pressable
        style={styles.inputForm}
        key={index}
        onPress={() => selectedTab === 0 && handleOrderClicked(item)}>
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  ...styles.locationText,
                  marginTop: 0,
                  textTransform: 'uppercase',
                }}>
                {source_meta?.city}
              </Text>
              <Text style={[styles.locationText, {textTransform: 'uppercase'}]}>
                {destination_meta?.city}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{...styles.locationText, marginTop: 0}}>
                DISTANCE
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(1),
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4.5),
                    color: Colors.inputTextColor,
                  }}>
                  {parseInt(
                    getDistance(
                      {latitude: item?.source_lat, longitude: item?.source_lng},
                      {
                        latitude: item?.destination_lat,
                        longitude: item?.destination_lng,
                      },
                    ) / 1000,
                  )}{' '}
                  KM
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.separatorView} />
        {selectedTab === 0 && (
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>price</Text>
            <Text style={styles.rightText}>
              Rs.{' '}
              {item?.status === 0 || item?.status === 1
                ? item?.final_estimated_quote
                : item?.final_quote}
            </Text>
          </View>
        )}
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>moving date</Text>
          <Text
            style={[styles.rightText, {maxWidth: '60%', textAlign: 'right'}]}>
            {dateArray.join(', ')}
          </Text>
        </View>
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>category</Text>
          <Text style={styles.rightText}>{meta?.subcategory || 'null'}</Text>
        </View>
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>status</Text>
          <Text style={[styles.rightText, {textTransform: 'capitalize'}]}>
            {status}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <HomeHeader navigation={props.navigation} title={'MY BOOKINGS'} />
      <View style={{height: hp(7), flexDirection: 'row'}}>
        {['Ongoing Orders', 'Past Orders'].map((item, index) => {
          return (
            <Pressable
              key={index}
              style={{
                ...styles.tabViews,
                ...STYLES.common,
                borderColor:
                  selectedTab === index ? Colors.darkBlue : '#ACABCD',
                borderBottomWidth: selectedTab === index ? 2 : 0.8,
              }}
              onPress={() => setSelectedTab(index)}>
              <Text
                style={{
                  ...styles.tabText,
                  color: selectedTab === index ? Colors.darkBlue : '#ACABCD',
                }}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={
            selectedTab === 0
              ? liveOrders.length > 0
                ? liveOrders
                : []
              : pastOrders.length > 0
              ? pastOrders
              : []
          }
          extraData={selectedTab === 0 ? liveOrders : pastOrders}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text
              style={{
                fontFamily: 'Roboto-Italic',
                fontSize: wp(3.5),
                color: '#99A0A5',
                textAlign: 'center',
                marginHorizontal: 20,
                marginVertical: hp(5),
              }}>
              No any orders!
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default MyBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  tabViews: {
    flex: 1,
  },
  tabText: {
    fontSize: wp(4),
    fontFamily: 'Roboto-Medium',
  },
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: wp(5),
    paddingHorizontal: wp(5),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(1),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(2),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
    textTransform: 'uppercase',
  },
  rightText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
  },
});
