import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import CustomModalAndroid from '../../../components/customModal';
import FlatButton from '../../../components/flatButton';
import {STYLES} from '../../../constant/commonStyle';
import CloseIcon from '../../../components/closeIcon';
import LocationDistance from '../../../components/locationDistance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Friends from '../../../assets/svg/friends.svg';
import MenuIcon from '../../../assets/svg/menu_icon.svg';
import HomeCall from '../../../assets/svg/home_call.svg';
import MySelf from '../../../assets/svg/myself.svg';
import Coupon from '../../../assets/svg/coupon.svg';
import {
  CustomAlert,
  CustomConsole,
  getLocation,
  LoadingScreen,
  resetNavigator,
} from '../../../constant/commonFun';
import {APICall, getServices, getSlider} from '../../../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {STORE} from '../../../redux';
import AsyncStorage from '@react-native-community/async-storage';
import Shimmer from 'react-native-shimmer';

export const HomeHeader = (props) => {
  return (
    <View
      style={[
        boxShadow,
        {
          height: 55,
          backgroundColor: Colors.white,
          flexDirection: 'row',
        },
      ]}>
      <Pressable
        style={{width: wp(13), height: '100%', ...styles.common}}
        onPress={() => props.navigation.toggleDrawer()}>
        <MenuIcon width={20} height={20} />
      </Pressable>
      <View
        style={{
          width: props.edit ? wp(74) : wp(87),
          height: '100%',
          ...styles.common,
        }}>
        {(props.title && (
          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              color: Colors.inputTextColor,
              fontSize: wp(5),
              marginRight: props.edit ? wp(0) : wp(13),
              textTransform: 'capitalize',
            }}>
            {props.title}
          </Text>
        )) || (
          <Image
            source={require('../../../assets/images/biddnest_logo.png')}
            resizeMode={'contain'}
            style={{
              height: '65%',
              width: '70%',
              marginRight: wp(13),
            }}
          />
        )}
      </View>
      {props.edit ? (
        <Pressable
          style={{...STYLES.common, width: wp(13)}}
          onPress={props.onEditPress}>
          <MaterialIcons name={'edit'} color={Colors.darkBlue} size={25} />
        </Pressable>
      ) : null}
    </View>
  );
};

const Home = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const configData = useSelector((state) => state.Login?.configData) || {};
  const [serviceData, setServiceData] = useState(
    useSelector((state) => state.Login?.serviceData?.services),
  );
  const [sliderData, setSliderData] = useState(
    useSelector((state) => state.Login?.sliderData?.sliders) || [],
  );
  const [couponVisible, setCouponVisible] = useState(false);
  const [bookingSelectionVisible, setBookingSelectionVisible] = useState(false);
  const [movementType, setMovementType] = useState();
  const [bookingFor, setBookingFor] = useState('Myself');
  const [isLoading, setLoading] = useState(true);
  const [contactUs, setContactUs] = useState({});

  useEffect(() => {
    if (isFocused && userData?.fname) {
      AsyncStorage.getItem('oneSignalData').then((signalData) => {
        let player_id = signalData && JSON.parse(signalData).userId;
        if (player_id) {
          let obj = {
            url: 'notification/player',
            method: 'post',
            headers: {
              Authorization:
                'Bearer ' + STORE.getState().Login?.loginData?.token,
            },
            data: {
              player_id: player_id,
            },
          };
          APICall(obj);
        }
      });
      getLocation()
        .then((locationData) => {
          setLoading(false);
          dispatch(getSlider(locationData))
            .then((res) => {
              if (res.status === 'success' && res?.data) {
                setSliderData(res?.data?.sliders);
              } else {
                CustomAlert(res.message);
              }
            })
            .catch((err) => {
              setLoading(false);
              CustomAlert(err?.data?.message);
            });
          dispatch(getServices(locationData))
            .then((res) => {
              setLoading(false);
              if (res.status === 'success' && res?.data?.services) {
                setServiceData(res?.data?.services);
              } else {
                CustomAlert(res.message);
              }
            })
            .catch((err) => {
              setLoading(false);
              CustomAlert(err?.data?.message);
            });
        })
        .catch((err) => {
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
    }
  }, [isFocused]);
  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          height: hp(15),
          width: wp(70),
          marginRight: wp(4),
        }}>
        <View
          style={[
            styles.topScroll,
            {
              ...styles.common,
            },
          ]}>
          <Image
            style={{
              height: '100%',
              width: '100%',
            }}
            source={{uri: item?.image}}
            resizeMode={'cover'}
            key={index}
          />
        </View>
      </View>
    );
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <HomeHeader navigation={props.navigation} />
      {isLoading && <LoadingScreen />}
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/*<LocationDistance inTransit={true} />*/}
        {sliderData.map((item, index) => {
          if (configData?.enums?.slider?.position?.main === item.position) {
            return (
              <FlatList
                key={item.id}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={item?.banners}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                contentContainerStyle={{
                  padding: wp(4),
                  paddingRight: 0,
                }}
              />
            );
          }
          return null;
        })}
        <View style={styles.movementView}>
          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              fontSize: wp(4),
              color: Colors.inputTextColor,
              textAlign: 'center',
              marginTop: hp(1),
            }}>
            MOVEMENT TYPE
          </Text>
          <FlatList
            bounces={false}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            data={serviceData}
            extraData={serviceData}
            keyExtractor={(item, index) => index}
            style={{marginTop: hp(2)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <LinearGradient
                  key={index}
                  colors={['#49039B', Colors.darkBlue]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.movementLinear}>
                  <Pressable
                    onPress={() => {
                      setMovementType(item);
                      setBookingSelectionVisible(true);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}>
                    <Image
                      source={{uri: item.image}}
                      style={{height: '50%', width: '50%'}}
                      resizeMode={'contain'}
                    />
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.white,
                        fontSize: wp(3.8),
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                  </Pressable>
                </LinearGradient>
              );
            }}
          />
        </View>
        <View style={styles.assistantView}>
          <View>
            <Text
              style={{
                fontFamily: 'Gilroy-Bold',
                fontSize: wp(6),
                color: Colors.darkBlue,
              }}>
              Need Assistance?
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                color: '#434343',
                fontSize: wp(3.6),
                marginTop: hp(2),
              }}>
              We are just a call away! {'\n'}(9123445566)
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Linking.openURL(
                `tel:${
                  contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]
                }`,
              );
            }}>
            <HomeCall width={55} height={55} />
          </Pressable>
        </View>
        {sliderData.map((item, index) => {
          if (
            configData?.enums?.slider?.position?.secondary === item.position
          ) {
            return (
              <FlatList
                key={item.id}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[1, 2]}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <Shimmer
                      key={index}
                      autoRun={true}
                      style={{
                        height: hp(25),
                        width: wp(60),
                        marginRight: wp(4),
                      }}
                      visible={true}>
                      <View
                        style={[
                          styles.topScroll,
                          {
                            width: wp(60),
                            height: hp(25),
                            ...styles.common,
                          },
                        ]}>
                        <Image
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                          source={require('../../../assets/images/top_home_scroll.png')}
                          resizeMode={'cover'}
                          key={index}
                        />
                      </View>
                    </Shimmer>
                  );
                }}
                contentContainerStyle={{
                  padding: wp(4),
                  paddingRight: 0,
                }}
              />
            );
          }
          return null;
        })}
        <CustomModalAndroid
          visible={couponVisible}
          onPress={() => setCouponVisible(false)}>
          <CloseIcon onPress={() => setCouponVisible(false)} />
          <Coupon width={hp(25)} height={hp(25)} />
          <Text style={STYLES.modalHeader}>DISCOUNT COUPON</Text>
          <Text
            style={{
              fontSize: wp(4),
              marginTop: hp(1),
              textAlign: 'center',
              ...styles.textStyle,
            }}>
            Get 20% off on your first order! {'\n'}So what are you waiting for,
            go ahead and proceed!
          </Text>
          <FlatButton label={'OKAY'} />
        </CustomModalAndroid>
        <CustomModalAndroid
          visible={bookingSelectionVisible}
          onPress={() => setBookingSelectionVisible(false)}>
          <Text style={STYLES.modalHeader}>WHOM ARE YOU BOOKING FOR?</Text>
          <CloseIcon onPress={() => setBookingSelectionVisible(false)} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: hp(3),
              width: wp(100),
            }}>
            <View style={styles.common}>
              <Pressable
                style={[
                  styles.selectionView,
                  {
                    borderWidth: bookingFor === 'Myself' ? 2 : 0,
                    ...STYLES.common,
                  },
                ]}
                onPress={() => setBookingFor('Myself')}>
                <MySelf width={60} height={60} />
              </Pressable>
              <Text style={styles.selectionText}>Myself</Text>
            </View>
            <View style={styles.common}>
              <Pressable
                onPress={() => setBookingFor('Others')}
                style={[
                  styles.selectionView,
                  {
                    borderWidth: bookingFor === 'Others' ? 2 : 0,
                    ...STYLES.common,
                  },
                ]}>
                <Friends width={60} height={60} />
              </Pressable>
              <Text style={styles.selectionText}>Somebody Else</Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              setBookingSelectionVisible(false);
              props.navigation.navigate('BookingStepper', {
                bookingFor,
                movementType,
              });
            }}
            style={{
              height: hp(7),
              backgroundColor: Colors.btnBG,
              width: wp(100),
              marginTop: hp(5),
              ...styles.common,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.white,
                fontSize: wp(5),
              }}>
              CONFIRM
            </Text>
          </Pressable>
        </CustomModalAndroid>
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topScroll: {
    height: hp(15),
    width: wp(70),
    borderRadius: 10,
    backgroundColor: Colors.silver,
    marginRight: wp(4),
    overflow: 'hidden',
  },
  movementView: {
    padding: wp(3),
    borderRadius: 10,
    borderColor: Colors.silver,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    width: wp(92),
    alignSelf: 'center',
  },
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
  },
  assistantView: {
    flexDirection: 'row',
    padding: wp(5),
    marginTop: hp(2),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.silver,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    width: wp(92),
    alignSelf: 'center',
  },
  textStyle: {
    fontFamily: 'Roboto-Medium',
    color: Colors.inputTextColor,
  },
  selectionView: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#F2E6FF',
    borderColor: Colors.darkBlue,
  },
  selectionText: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: wp(4),
    color: '#3B4B58',
    marginTop: hp(1),
  },
});
