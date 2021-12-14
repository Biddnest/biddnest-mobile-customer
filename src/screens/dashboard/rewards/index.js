import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import FlatButton from '../../../components/flatButton';
import {Colors, hp, wp} from '../../../constant/colors';
import {STYLES} from '../../../constant/commonStyle';
import {HomeHeader} from '../home';
import Button from '../../../components/button';
import CustomModalAndroid from '../../../components/customModal';
import {STORE} from '../../../redux';
import {CustomAlert} from '../../../constant/commonFun';
import {APICall} from '../../../redux/actions/user';
import GreenArrow from '../../../assets/images/rewards-green-arrow.svg';
import RedArrow from '../../../assets/images/rewards-red-arrow.svg';
import MaskImage from '../../../assets/images/mask_group.png';
import {Divider} from 'react-native-elements';
import moment from 'moment';
import SimpleHeader from '../../../components/simpleHeader';

const data = [
  {
    id: 1,
    text: 'For Participating in payment process',
    dateText: '06 Dec, 05.45pm',
    price: 500,
  },
  {
    id: 2,
    text: 'For Participating in payment process',
    dateText: '06 Dec, 05.45pm',
    price: 500,
  },
  {
    id: 3,
    text: 'For Participating in payment process',
    dateText: '06 Dec, 05.45pm',
    price: 500,
  },
];

export default function Rewards(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDetailVoucher, setDetailVoucher] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [rewards, setRewards] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [voucherData, setVoucherData] = useState([]);

  const [voucherModalData, setVoucherModalData] = useState([]);

  useEffect(() => {
    let obj = {
      url: 'reward-points/balance',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setRewards(res?.data?.data?.wallet);
      })
      .catch((err) => {
        setLoading(false);
        CustomAlert(err?.data?.message);
      });
  }, []);

  useEffect(() => {
    let obj = {
      url: 'reward-points/ledger',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res.status === 200) {
          setTransactionHistory(res?.data?.data?.ledger);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomAlert(err?.data?.message);
      });
  }, []);
  //

  useEffect(() => {
    let obj = {
      url: 'vouchers',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res.status === 200) {
          setVoucherData(res?.data?.data?.vouchers);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomAlert(err?.data?.message);
      });
  }, []);

  const renderItem = ({item}) => {
    return (
      <>
        <View style={styles.flexContainer}>
          <View
            style={{
              width: '15%',
            }}>
            {parseInt(item?.amount) > 0 ? (
              <GreenArrow width={hp(5)} height={hp(5)} />
            ) : (
              <RedArrow width={hp(5)} height={hp(5)} />
            )}
          </View>
          <View style={{width: 0, flexGrow: 1, flex: 1}}>
            <Text style={styles.transactionList}>{item?.meta?.desc}</Text>
            <Text style={styles.transactionList}>
              {moment(item.created_at).format('ll')}
            </Text>
          </View>
          <View style={styles.pricePoints}>
            <Text style={{textAlign: 'center'}}>{item?.amount}</Text>
          </View>
        </View>
        <Divider style={{marginTop: hp(4)}} />
      </>
    );
  };

  const Vouchers = () => {
    const voucheraData = [
      {id: 1, price: 350, text: 'On your first order 4 meal', time: 'expired'},
      {id: 2, price: 350, text: 'On your first order 4 meal', time: 'expired'},
      {id: 2, price: 350, text: 'On your first order 4 meal', time: 'expired'},
      {id: 2, price: 350, text: 'On your first order 4 meal', time: 'expired'},
    ];
    return (
      <View>
        <CustomModalAndroid
          visible={showDetailVoucher}
          onPress={() => setDetailVoucher(false)}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-evenly',
                marginTop: hp(3),
                width: wp(80),
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 100,
                  backgroundColor: ' white',
                  padding: wp(2),
                  borderColor: '#DEE6ED',
                  marginRight: 10,
                }}>
                <Image
                  source={{url: voucherModalData?.meta?.image}}
                  style={{width: 50, height: 50}}
                />
              </View>
              <View style={styles.common}>
                <Text style={{fontWeight: 'bold'}}>
                  {voucherModalData?.meta?.title}
                </Text>
                <Text
                  style={{
                    flexWrap: 'wrap',
                    width: wp(70),
                    fontFamily: 'Roboto-Light',
                    marginTop: hp(1),
                  }}>
                  {voucherModalData?.meta?.desc}
                </Text>
              </View>
            </View>
            <Divider style={{margin: hp(3)}} />
            <View>
              <Text style={{fontFamily: 'Roboto-Light', marginBottom: hp(2)}}>
                Valid till: {moment(voucherModalData?.expires_at).format('ll')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  borderWidth: 2,
                  padding: wp(2),
                  borderRadius: 20,
                  borderStyle: 'dotted',
                  borderColor: 'grey',
                  width: wp(80),
                }}>
                <Text
                  style={{textAlign: 'center', fontFamily: 'Roboto-Light'}}
                  selectable={true}>
                  Code: {voucherModalData?.voucher_code}
                </Text>
              </View>
              <Text style={{color: Colors.btnBG, marginLeft: wp(2)}}>Copy</Text>
            </View>

            <Divider style={{margin: hp(3)}} />

            <View>
              <Text style={{fontFamily: 'Roboto-Light', marginBottom: hp(2)}}>
                How to use:{' '}
              </Text>

              <Text style={{fontFamily: 'Roboto-Light', flexWrap: 'wrap'}}>
                Lorem epsom korem im test lorem
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              setDetailVoucher(true);
            }}
            style={{
              height: hp(7),
              backgroundColor: Colors.btnBG,
              width: wp(100),
              marginTop: hp(5),
              ...styles.common,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.white,
                fontSize: wp(5),
                textAlign: 'center',
              }}>
              CONFIRM
            </Text>
          </Pressable>
        </CustomModalAndroid>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={2}
          data={voucherData}
          //  key={data.id}
          renderItem={({item}) => {
            return (
              <Pressable
                style={[styles.movementView, {width: '48%'}]}
                onPress={() => {
                  setVoucherModalData(item);
                  setDetailVoucher(true);
                }}>
                <View>
                  <Text style={{fontWeight: 'bold', fontFamily: 'Roboto'}}>
                    Rs: {item?.meta?.title} OFF
                  </Text>
                  <Text style={{marginVertical: 10, fontSize: hp(2)}}>
                    Voucher
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Light',
                      color: Colors.grey,
                      fontSize: wp(3.2),
                    }}>
                    {item?.meta.desc}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp(2),
                    flexWrap: 'wrap',
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: ' white',
                      padding: wp(2),
                      borderColor: '#DEE6ED',
                    }}>
                    <Image
                      source={{url: item?.meta?.image}}
                      style={{width: 30, height: 30}}
                    />
                  </View>
                  <Text style={{marginLeft: wp(3), fontFamily: 'Gilroy-bold'}}>
                    Expiring soon
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    );
  };

  const RewardsPoints = () => {
    return (
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          source={MaskImage}
          style={{width: '100%', height: '100%', flex: 1}}>
          <View style={styles.points}>
            {rewards.balance ? (
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                {parseInt(rewards?.balance)}
              </Text>
            ) : (
              <Text>Loading</Text>
            )}

            <Text style={{fontFamily: 'Gilroy'}}>
              Available Points in Wallet
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.movementView}>
          <Text
            style={[styles.transactionList, {fontSize: wp(4), padding: wp(2)}]}>
            Transaction List
          </Text>
          <Divider style={{marginTop: wp(2)}} />

          <FlatList
            renderItem={renderItem}
            data={transactionHistory}
            keyExtractor={(item, index) => item.id}
            bounces={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />

          <Button label={'REEDEM'} />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleHeader
        headerText={'REWARDS'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <View style={{height: hp(7), flexDirection: 'row'}}>
        {['Reward Points', 'Voucher'].map((item, index) => {
          return (
            <Ripple
              rippleColor={Colors.darkBlue}
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
                  ...STYLES.tabText,
                  color: selectedTab === index ? Colors.darkBlue : '#ACABCD',
                }}>
                {item}
              </Text>
            </Ripple>
          );
        })}
      </View>
      <View style={{marginHorizontal: 10, marginVertical: 20}}>
        {selectedTab === 0 && RewardsPoints()}

        {selectedTab === 1 && Vouchers()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  tabViews: {
    flex: 1,
  },
  points: {
    padding: hp(2),
    borderColor: Colors.pageBG,
    borderRadius: wp(2),
  },
  movementView: {
    padding: wp(2),
    borderRadius: 10,
    borderColor: Colors.silver,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    width: wp(92),
    alignSelf: 'center',
    marginTop: hp(2),
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: wp(10),
    alignItems: 'center',
  },
  transactionList: {
    fontFamily: 'Roboto-light',
    fontSize: wp(3.2),
    color: Colors.grey,
    textTransform: 'capitalize',
    fontWeight: '100',
    letterSpacing: 1,
    // width: '90%',
    // flexWrap: 'wrap',
    // flexShrink: 1,
    // flex: 1
  },
  pricePoints: {
    backgroundColor: Colors.silver,
    borderRadius: wp(3),
    justifyContent: 'center',
    padding: wp(2),
    width: '15%',
  },
});
