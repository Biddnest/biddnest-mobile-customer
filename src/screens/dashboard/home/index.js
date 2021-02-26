import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import Shimmer from '../../../components/shimmer';
import LinearGradient from 'react-native-linear-gradient';
import CustomModalAndroid from '../../../components/customModal';
import FlatButton from '../../../components/flatButton';
import {STYLES} from '../../../constant/commonStyle';
import CloseIcon from '../../../components/closeIcon';
import LocationDistance from '../../../components/locationDistance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        <Image
          source={require('../../../assets/images/menu_icon.png')}
          resizeMode={'contain'}
          style={{
            height: 20,
            width: 20,
          }}
        />
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
              fontFamily: 'Gilroy-Semibold',
              color: Colors.inputTextColor,
              fontSize: wp(4.5),
              marginRight: props.edit ? wp(0) : wp(13),
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
  const [couponVisible, setCouponVisible] = useState(false);
  const [bookingSelectionVisible, setBookingSelectionVisible] = useState(false);
  const [movementType, setMovementType] = useState('');
  const [bookingFor, setBookingFor] = useState('Myself');
  const renderItem = ({item, index}) => {
    return (
      <Shimmer
        autoRun={true}
        style={{
          height: hp(15),
          width: wp(70),
          marginRight: wp(4),
        }}
        visible={true}>
        <View
          style={[
            styles.topScroll,
            {
              ...styles.common,
            },
          ]}
          key={index}>
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
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]}>
      <HomeHeader navigation={props.navigation} />
      <ScrollView
        style={{marginBottom: hp(7)}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <LocationDistance inTransit={true} />
        <FlatList
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: wp(4),
            paddingRight: 0,
            height: hp(20),
          }}
          style={{height: hp(20)}}
        />
        <View style={styles.movementView}>
          <Text
            style={{
              fontFamily: 'Gilroy-Light',
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
            data={[
              {
                image: (
                  <Image
                    source={require('../../../assets/images/home_tab.png')}
                    resizeMode={'contain'}
                    style={{height: 40, width: 40}}
                  />
                ),
                name: 'Residential',
              },
              {
                image: (
                  <Image
                    source={require('../../../assets/images/supermarket_tab.png')}
                    resizeMode={'contain'}
                    style={{height: 40, width: 40}}
                  />
                ),
                name: 'Commercial',
              },
              {
                image: (
                  <Image
                    source={require('../../../assets/images/building_tab.png')}
                    resizeMode={'contain'}
                    style={{height: 40, width: 40}}
                  />
                ),
                name: 'Office',
              },
            ]}
            style={{marginTop: hp(2)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <LinearGradient
                  colors={['#49039B', Colors.darkBlue]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.movementLinear}>
                  <Pressable
                    onPress={() => {
                      setMovementType(item.name);
                      setBookingSelectionVisible(true);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}>
                    {item.image}
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.white,
                        fontSize: wp(3.8),
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
                fontFamily: 'Roboto-Bold',
                fontSize: wp(5),
                color: Colors.darkBlue,
              }}>
              NEED ASSISTANCE?
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: '#434343',
                fontSize: wp(3.6),
                marginTop: hp(2),
              }}>
              We are just a call away! {'\n'}(9123445566)
            </Text>
          </View>
          <Image
            source={require('../../../assets/images/home_call.png')}
            resizeMode={'contain'}
            style={{height: 55, width: 55}}
          />
        </View>
        <FlatList
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          renderItem={({item, index}) => {
            return (
              <Shimmer
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
                  ]}
                  key={index}>
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
        <CustomModalAndroid visible={couponVisible}>
          <CloseIcon
            onPress={() => setCouponVisible(false)}
            style={{
              position: 'absolute',
              right: 15,
              top: Platform.OS === 'android' ? 0 : -10,
            }}
          />
          <Image
            source={require('../../../assets/images/coupon.png')}
            resizeMode={'contain'}
            style={{
              height: 200,
              width: 200,
            }}
          />
          <Text
            style={{
              marginTop: hp(3),
              fontSize: wp(5),
              ...styles.textStyle,
            }}>
            DISCOUNT COUPON
          </Text>
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
        <CustomModalAndroid visible={bookingSelectionVisible}>
          <CloseIcon
            onPress={() => setBookingSelectionVisible(false)}
            style={{
              position: 'absolute',
              right: 15,
            }}
          />
          <Text
            style={{
              fontSize: wp(4.5),
              fontFamily: 'Roboto-Regular',
              color: Colors.inputTextColor,
            }}>
            WHOM ARE YOU BOOKING FOR?
          </Text>
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
                <Image
                  source={require('../../../assets/images/myself.png')}
                  resizeMode={'contain'}
                  style={{height: '60%', width: '60%'}}
                />
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
                <Image
                  source={require('../../../assets/images/friends.png')}
                  resizeMode={'contain'}
                  style={{height: '60%', width: '60%'}}
                />
              </Pressable>
              <Text style={styles.selectionText}>Others</Text>
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
  container: {
    // flex: 1,
    backgroundColor: Colors.pageBG,
  },
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
    marginTop: hp(3),
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
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: '#3B4B58',
    marginTop: hp(1),
  },
});
