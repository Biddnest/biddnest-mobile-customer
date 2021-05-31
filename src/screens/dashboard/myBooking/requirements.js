import React, {useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {STYLES} from '../../../constant/commonStyle';
import {useSelector} from 'react-redux';
import {Html5Entities} from 'html-entities';
import {getOrderDetails} from '../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';
import Lightbox from 'react-native-lightbox';

const Requirements = (props) => {
  const entities = new Html5Entities();
  const [orderDetails, setOrderDetails] = useState(props?.orderDetails || {});
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.service) || {};
  let meta =
    (orderDetails?.meta && JSON.parse(orderDetails?.meta?.toString())) || {};

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = () => {
    if (orderDetails?.public_booking_id) {
      getOrderDetails(orderDetails?.public_booking_id)
        .then((res) => {
          if (res?.data?.status === 'success') {
            setOrderDetails(res?.data?.data?.booking);
          } else {
            CustomAlert(res?.data?.message);
          }
        })
        .catch((err) => {
          CustomConsole(err);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(2)}}
        bounces={false}>
        <View>
          <View
            style={{
              marginHorizontal: wp(10),
              marginTop: hp(2),
            }}>
            <View style={[STYLES.flexBox, {marginTop: 0}]}>
              <Text style={STYLES.leftText}>category</Text>
              <Text style={[STYLES.rightText, {marginBottom: hp(2)}]}>
                {orderDetails?.service?.name}
              </Text>
            </View>
          </View>
          <View style={[STYLES.inputForm, {marginTop: 0}]}>
            <Text
              style={{
                fontFamily: 'Gilroy-SemiBold',
                fontSize: wp(4),
                color: Colors.inputTextColor,
                textAlign: 'center',
                marginVertical: hp(1.5),
              }}>
              ITEM LIST
            </Text>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              bounces={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{marginTop: hp(2)}}
              data={orderDetails?.inventories || []}
              extraData={orderDetails?.inventories}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.textWrapper} key={index}>
                    <View style={{width: '75%'}}>
                      <Text style={styles.headerText}>{item.name}</Text>
                      <Text
                        style={[
                          styles.headerText,
                          {
                            fontFamily: 'Roboto-Regular',
                            marginTop: 5,
                            fontSize: wp(3.5),
                            textTransform: 'capitalize',
                          },
                        ]}>
                        {item?.material}, {item?.size}
                      </Text>
                    </View>
                    <Text style={styles.rightText}>
                      x
                      {configData?.inventory_quantity_type.range ===
                      item?.quantity_type
                        ? JSON.parse(item?.quantity?.toString()).min +
                          '-' +
                          JSON.parse(item?.quantity?.toString()).max
                        : item?.quantity}
                    </Text>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={[STYLES.separatorView, {marginBottom: hp(2)}]} />
              )}
            />
          </View>
          {meta?.customer &&
            JSON.parse(meta?.customer?.toString()).remarks !== null && (
              <View style={STYLES.inputForm}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: wp(4),
                    color: Colors.inputTextColor,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>
                  Comments
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Italic',
                    fontSize: wp(3.6),
                    color: Colors.inputTextColor,
                    marginTop: hp(2),
                  }}>
                  {meta?.customer
                    ? entities.decode(
                        JSON.parse(meta?.customer?.toString()).remarks,
                      )
                    : 'No Any comments'}
                </Text>
              </View>
            )}
          {meta?.images?.length > 0 && (
            <View style={STYLES.inputForm}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: wp(4),
                  color: Colors.inputTextColor,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                Pictures uploaded by the customer
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                  paddingTop: hp(2),
                }}>
                {meta?.images?.map((item, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {}}
                      style={{
                        height: wp(16),
                        width: wp(16),
                        borderRadius: wp(3),
                        backgroundColor: Colors.silver,
                        marginRight: wp(3),
                        overflow: 'hidden',
                      }}>
                      <Lightbox>
                        <Image
                          source={{uri: item}}
                          style={{height: '100%', width: '100%'}}
                          resizeMode={'contain'}
                        />
                      </Lightbox>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Requirements;

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: Colors.pageBG,
    overflow: 'hidden',
    fontSize: wp(3.5),
  },
  headerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4),
    color: Colors.inputTextColor,
  },
});
