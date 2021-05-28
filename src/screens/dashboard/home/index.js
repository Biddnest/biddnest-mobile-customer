import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import CustomModalAndroid from '../../../components/customModal';
import FlatButton from '../../../components/flatButton';
import {STYLES} from '../../../constant/commonStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Friends from '../../../assets/svg/friends.svg';
import MenuIcon from '../../../assets/svg/menu_icon.svg';
import HomeCall from '../../../assets/svg/home_call.svg';
import MySelf from '../../../assets/svg/myself.svg';
import Coupon from '../../../assets/svg/coupon.svg';
import Quote from '../../../assets/svg/quote.svg';
import BiddnestLogo from '../../../assets/svg/biddnest_logo.svg';
import {
  CustomAlert,
  CustomConsole,
  getLocation,
  LoadingScreen,
} from '../../../constant/commonFun';
import {
  APICall,
  getServices,
  getSlider,
  getTestimonials,
} from '../../../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {STORE} from '../../../redux';
import AsyncStorage from '@react-native-community/async-storage';
import {CustomTabs} from 'react-native-custom-tabs';
import Shimmer from 'react-native-shimmer';
import {isAndroid} from 'react-native-calendars/src/expandableCalendar/commons';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import HTML from 'react-native-render-html';
import ChatBot from '../../../assets/svg/chat_bot.svg';
import Ripple from 'react-native-material-ripple';
import {AirbnbRating} from 'react-native-elements';

export const HomeHeader = (props) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        boxShadow,
        {
          height: hp(7.5),
          backgroundColor: Colors.white,
          flexDirection: 'row',
        },
      ]}>
      <Pressable
        style={{width: wp(13), height: '100%', ...styles.common}}
        onPress={() => props.navigation.toggleDrawer()}>
        <MenuIcon width={wp(5)} height={hp(2.2)} />
      </Pressable>
      <View
        style={{
          width: props.edit ? wp(64) : wp(74),
          height: '100%',
          ...styles.common,
        }}>
        {(props.title && (
          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              color: Colors.inputTextColor,
              fontSize: wp(5),
              marginRight: props.edit ? -wp(3) : wp(0),
              textTransform: 'capitalize',
            }}>
            {props.title}
          </Text>
        )) || <BiddnestLogo height={'55%'} width={'70%'} />}
      </View>
      <Pressable
        style={{...STYLES.common, width: wp(13)}}
        onPress={() => {
          navigation.navigate('ContactUs');
        }}>
        <ChatBot width={hp(6.5)} height={hp(6.5)} />
      </Pressable>
      {props.edit ? (
        <Pressable
          style={{...STYLES.common, width: wp(10)}}
          onPress={props.onEditPress}>
          <MaterialIcons name={'edit'} color={Colors.darkBlue} size={hp(3.5)} />
        </Pressable>
      ) : null}
    </View>
  );
};

const Home = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const sliderSize =
    useSelector((state) => state.Login?.configData?.enums?.slider) || {};
  const configData = useSelector((state) => state.Login?.configData) || {};
  const [serviceData, setServiceData] = useState(
    useSelector((state) => state.Login?.serviceData?.services),
  );
  const [sliderData, setSliderData] = useState(
    useSelector((state) => state.Login?.sliderData?.sliders) || [],
  );
  const [testimonialData, setTestimonialData] = useState(
    useSelector((state) => state.Login?.testimonials?.testimonials) || [],
  );
  const [couponVisible, setCouponVisible] = useState(false);
  const [bookingSelectionVisible, setBookingSelectionVisible] = useState(false);
  const [movementType, setMovementType] = useState();
  const [bookingFor, setBookingFor] = useState('Myself');
  const [isLoading, setLoading] = useState(true);
  const [contactUs, setContactUs] = useState({});
  const [selectedTestimonial, setSelectedTestimonial] = useState({});
  const [activeSlide1, setActiveSlide1] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);
  const carousel1 = useRef(null);
  const carousel2 = useRef(null);

  useEffect(() => {
    if (isFocused && userData?.fname) {
      let obj = {
        url: 'auth/verify',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          CustomAlert(err?.data?.message);
        });
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
          setLoading(true);
          dispatch(getSlider(locationData, props))
            .then((res) => {
              if (res.status === 'success' && res?.data) {
                setSliderData(res?.data?.sliders);
              } else {
                CustomAlert(res.message);
              }
            })
            .catch((err) => {
              CustomAlert(err?.data?.message);
            });
          dispatch(getServices(locationData, props))
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
          dispatch(getTestimonials())
            .then((res) => {
              setLoading(false);
              if (res.status === 'success' && res?.data?.testimonials) {
                setTestimonialData(res?.data?.testimonials);
                setSelectedTestimonial(
                  res?.data?.testimonials?.length > 0 &&
                    res?.data?.testimonials[0],
                );
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
    let mainSize = [];
    Object.values(sliderSize.size).forEach((i, ind) => {
      if (i === item?.banner_size) {
        mainSize =
          sliderSize?.banner_dimensions[Object.keys(sliderSize.size)[ind]];
      }
    });
    return (
      <Pressable
        key={index}
        onPress={() => {
          if (item?.url && item.url !== '') {
            if (isAndroid) {
              CustomTabs.openURL(item?.url, {
                toolbarColor: Colors.darkBlue,
              })
                .then(() => {})
                .catch((err) => {
                  console.log(err);
                });
            } else {
              Linking.openURL(item?.url);
            }
          }
        }}
        style={[
          styles.topScroll,
          {
            ...styles.common,
            height: mainSize.length > 0 && mainSize[1],
            width: mainSize.length > 0 && mainSize[0],
          },
        ]}>
        <Image
          style={{
            height: '100%',
            width: '100%',
          }}
          source={{uri: item?.image}}
          resizeMode={'contain'}
          key={index}
        />
      </Pressable>
    );
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <HomeHeader navigation={props.navigation} />
      {isLoading && <LoadingScreen />}
      <ScrollView
        style={{flex: 1, marginTop: hp(2)}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/*<LocationDistance inTransit={true} />*/}
        {sliderData.length === 0 && (
          <Shimmer
            style={{
              height: hp(18),
              width: wp(90),
              backgroundColor: Colors.silver,
              alignSelf: 'center',
              marginVertical: hp(2),
              borderRadius: hp(1),
            }}
          />
        )}
        {sliderData.map((item, index) => {
          if (configData?.enums?.slider?.position?.main === item.position) {
            let bottomSize = [];
            Object.values(sliderSize.size).forEach((i, ind) => {
              if (i === item?.size) {
                bottomSize =
                  sliderSize?.banner_dimensions[
                    Object.keys(sliderSize.size)[ind]
                  ];
              }
            });
            return (
              <View key={item.id}>
                <Carousel
                  key={item.id}
                  contentContainerStyle={{
                    padding: wp(4),
                    paddingRight: 0,
                    paddingBottom: 0,
                  }}
                  loop={true}
                  ref={carousel1}
                  data={item?.banners}
                  loopClonesPerSide={item?.banners?.length - 1}
                  renderItem={renderItem}
                  lockScrollWhileSnapping={true}
                  sliderWidth={wp(100)}
                  itemWidth={bottomSize.length > 0 && bottomSize[0]}
                  autoplay={true}
                  // slideStyle={{marginHorizontal: wp(2)}}
                  layout="default"
                  useNativeDriver
                  inactiveSlideScale={0.8}
                  autoplayDelay={5000}
                  onSnapToItem={(index) => setActiveSlide1(index)}
                />
                <Pagination
                  dotsLength={item?.banners?.length}
                  activeDotIndex={activeSlide1}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    marginTop: -hp(2),
                    marginBottom: -hp(3),
                  }}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.darkBlue,
                  }}
                  inactiveDotStyle={
                    {
                      // Define styles for inactive dots here
                    }
                  }
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
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
            WHAT WOULD YOU LIKE TO MOVE
          </Text>
          <FlatList
            bounces={false}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            data={serviceData}
            extraData={serviceData}
            keyExtractor={(item, index) => index.toString()}
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
                  <Ripple
                    rippleColor={Colors.white}
                    onPress={() => {
                      setMovementType(item);
                      setBookingSelectionVisible(true);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: hp(12),
                    }}>
                    <Image
                      source={{uri: item.image}}
                      style={{height: hp(4.5), width: hp(4.5)}}
                      resizeMode={'contain'}
                    />
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.white,
                        fontSize: wp(3.8),
                        textAlign: 'center',
                        marginTop: 5,
                      }}>
                      {item.name}
                    </Text>
                  </Ripple>
                </LinearGradient>
              );
            }}
          />
        </View>
        <View
          style={[
            styles.assistantView,
            {
              flexDirection: 'column',
            },
          ]}>
          <View>
            <Image
              source={require('../../../assets/images/support_icon.png')}
              style={{height: hp(20), width: hp(20)}}
              resizeMode={'contain'}
            />
          </View>
          <View
            style={[
              {
                flexDirection: 'row',
                padding: wp(3),
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(90),
                alignSelf: 'center',
              },
            ]}>
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
                  marginTop: hp(1),
                }}>
                We are just a call away! {'\n'}(9123445566)
              </Text>
            </View>
            <Ripple
              rippleColor={Colors.white}
              onPress={() => {
                Linking.openURL(
                  `tel:${
                    contactUs?.contact_no?.length > 0 && contactUs.contact_no[0]
                  }`,
                );
              }}>
              <HomeCall width={hp(7)} height={hp(7)} />
            </Ripple>
          </View>
        </View>
        {sliderData.map((item, index) => {
          if (
            configData?.enums?.slider?.position?.secondary === item.position
          ) {
            let bottomSize = [];
            Object.values(sliderSize.size).forEach((i, ind) => {
              if (i === item?.size) {
                bottomSize =
                  sliderSize?.banner_dimensions[
                    Object.keys(sliderSize.size)[ind]
                  ];
              }
            });
            return (
              <View key={item?.id}>
                <Carousel
                  loop={true}
                  key={item?.id}
                  ref={carousel2}
                  data={item?.banners}
                  renderItem={({item, index}) => {
                    let bottomSize = [];
                    Object.values(sliderSize.size).forEach((i, ind) => {
                      if (i === item?.banner_size) {
                        bottomSize =
                          sliderSize?.banner_dimensions[
                            Object.keys(sliderSize.size)[ind]
                          ];
                      }
                    });
                    return (
                      <Pressable
                        onPress={() => {
                          if (item?.url && item.url !== '') {
                            if (isAndroid) {
                              CustomTabs.openURL(item?.url, {
                                toolbarColor: Colors.darkBlue,
                              })
                                .then(() => {})
                                .catch((err) => {
                                  console.log(err);
                                });
                            } else {
                              Linking.openURL(item?.url);
                            }
                          }
                        }}
                        key={index}
                        style={[
                          styles.topScroll,
                          {
                            ...styles.common,
                            height: bottomSize.length > 0 && bottomSize[1],
                            width: bottomSize.length > 0 && bottomSize[0],
                          },
                        ]}>
                        <Image
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                          source={{uri: item?.image}}
                          resizeMode={'contain'}
                          key={index}
                        />
                      </Pressable>
                    );
                  }}
                  sliderWidth={wp(100)}
                  itemWidth={bottomSize.length > 0 && bottomSize[0]}
                  autoplay={true}
                  slideStyle={{marginHorizontal: wp(2)}}
                  layout="default"
                  inactiveSlideScale={1}
                  autoplayDelay={5000}
                  onSnapToItem={(index) => setActiveSlide2(index)}
                />
                <Pagination
                  dotsLength={item?.banners?.length}
                  activeDotIndex={activeSlide2}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    marginTop: -hp(2),
                    marginBottom: -hp(3),
                  }}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.darkBlue,
                  }}
                  inactiveDotStyle={
                    {
                      // Define styles for inactive dots here
                    }
                  }
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
              // <FlatList
              //   key={item.id}
              //   bounces={false}
              //   horizontal
              //   showsHorizontalScrollIndicator={false}
              //   data={item?.banners}
              //   keyExtractor={(item, index) => index.toString()}
              //   renderItem={({item, index}) => {
              //     let bottomSize = [];
              //     Object.values(sliderSize.size).forEach((i, ind) => {
              //       if (i === item?.banner_size) {
              //         bottomSize =
              //           sliderSize?.banner_dimensions[
              //             Object.keys(sliderSize.size)[ind]
              //           ];
              //       }
              //     });
              //     return (
              //       <Pressable
              //         onPress={() => {
              //           if (item?.url && item.url !== '') {
              //             if (isAndroid) {
              //               CustomTabs.openURL(item?.url, {
              //                 toolbarColor: Colors.darkBlue,
              //               })
              //                 .then(() => {})
              //                 .catch((err) => {
              //                   console.log(err);
              //                 });
              //             } else {
              //               Linking.openURL(item?.url);
              //             }
              //           }
              //         }}
              //         key={index}
              //         style={[
              //           styles.topScroll,
              //           {
              //             ...styles.common,
              //             height: bottomSize.length > 0 && bottomSize[1],
              //             width: bottomSize.length > 0 && bottomSize[0],
              //           },
              //         ]}>
              //         <Image
              //           style={{
              //             height: '100%',
              //             width: '100%',
              //           }}
              //           source={{uri: item?.image}}
              //           resizeMode={'contain'}
              //           key={index}
              //         />
              //       </Pressable>
              //     );
              //   }}
              //   contentContainerStyle={{
              //     padding: wp(4),
              //     paddingTop: 0,
              //     paddingRight: 0,
              //   }}
              // />
            );
          } else {
            return null;
          }
        })}
        <Text
          style={{
            marginTop: hp(3),
            textAlign: 'center',
            color: Colors.darkBlue,
            fontSize: wp(5),
            fontFamily: 'Gilroy-Bold',
          }}>
          What Our Customers Say
        </Text>
        <View
          style={[
            styles.assistantView,
            {
              justifyContent: 'flex-start',
              paddingVertical: hp(2),
            },
          ]}>
          <View
            style={{
              marginHorizontal: wp(3),
              marginVertical: hp(3),
            }}>
            <Quote height={hp(5)} width={hp(5)} />
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderColor: Colors.silver,
              paddingLeft: wp(4),
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: 'Gilroy-Bold',
                color: Colors.darkBlue,
                fontSize: wp(4),
              }}>
              {selectedTestimonial?.name}
            </Text>
            <View
              style={{
                flex: 1,
                alignSelf: 'flex-start',
                marginTop: hp(0.2),
                marginBottom: hp(1),
              }}>
              <AirbnbRating
                key={selectedTestimonial?.id}
                readonly={true}
                fractions={1}
                defaultRating={
                  (selectedTestimonial?.ratings &&
                    parseInt(selectedTestimonial?.ratings)) ||
                  3
                }
                ratingContainerStyle={{paddingHorizontal: wp(5)}}
                ratingCount={5}
                size={wp(4)}
                showRating={false}
              />
            </View>
            <HTML
              defaultTextProps={{
                width: wp(70),
                marginTop: hp(1),
              }}
              baseFontStyle={{
                fontFamily: 'Roboto-Light',
                color: Colors.grey,
                fontSize: wp(3.2),
              }}
              source={{html: selectedTestimonial?.desc}}
              contentWidth={'90%'}
            />
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={testimonialData}
            bounces={false}
            horizontal
            contentContainerStyle={{marginBottom: hp(2)}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  onPress={() => {
                    setSelectedTestimonial(item);
                  }}
                  key={index}
                  style={{
                    marginLeft: wp(5),
                    opacity: item?.id === selectedTestimonial?.id ? 1 : 0.3,
                  }}>
                  <View
                    style={{
                      height: hp(8),
                      width: hp(8),
                      borderRadius: hp(4),
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{uri: item?.image}}
                      resizeMode={'contain'}
                      style={{height: '100%', width: '100%'}}
                    />
                  </View>
                  <View
                    style={{
                      height: hp(0.8),
                      width: hp(0.8),
                      borderRadius: hp(0.4),
                      backgroundColor:
                        item?.id === selectedTestimonial?.id
                          ? Colors.darkBlue
                          : 'transparent',
                      alignSelf: 'center',
                      marginTop: hp(1),
                    }}
                  />
                </Pressable>
              );
            }}
          />
        </View>
      </ScrollView>
      <CustomModalAndroid
        visible={couponVisible}
        onPress={() => setCouponVisible(false)}>
        <Coupon width={hp(25)} height={hp(25)} />
        <Text style={STYLES.modalHeader}>DISCOUNT COUPON</Text>
        <Text
          style={{
            fontSize: wp(4),
            marginTop: hp(1),
            textAlign: 'center',
            ...styles.textStyle,
          }}>
          Get 20% off on your first order! {'\n'}So what are you waiting for, go
          ahead and proceed!
        </Text>
        <FlatButton label={'OKAY'} />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={bookingSelectionVisible}
        title={'WHOM ARE YOU BOOKING FOR?'}
        onPress={() => setBookingSelectionVisible(false)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: hp(3),
            width: wp(100),
          }}>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              style={[
                styles.selectionView,
                {
                  borderWidth: bookingFor === 'Myself' ? 2 : 0,
                  backgroundColor:
                    bookingFor === 'Myself' ? '#F2E6FF' : Colors.silver,
                  ...STYLES.common,
                },
              ]}
              onPress={() => setBookingFor('Myself')}>
              <MySelf width={hp(8)} height={hp(8)} />
            </Ripple>
            <Text style={styles.selectionText}>Myself</Text>
          </View>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              onPress={() => setBookingFor('Others')}
              style={[
                styles.selectionView,
                {
                  borderWidth: bookingFor === 'Others' ? 2 : 0,
                  backgroundColor:
                    bookingFor === 'Others' ? '#F2E6FF' : Colors.silver,
                  ...STYLES.common,
                },
              ]}>
              <Friends width={hp(8)} height={hp(8)} />
            </Ripple>
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
    borderRadius: 10,
    backgroundColor: Colors.silver,
    // marginRight: wp(3),
    overflow: 'hidden',
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
  movementLinear: {
    // flex: 1,
    width: '30%',
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
  },
  assistantView: {
    flexDirection: 'row',
    padding: wp(3),
    marginVertical: hp(2),
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
    height: hp(12),
    width: hp(12),
    borderRadius: hp(6),
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
