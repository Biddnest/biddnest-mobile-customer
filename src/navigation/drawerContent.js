import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors, hp, SIDE_DRAWER, wp} from '../constant/colors';
import {STYLES} from '../constant/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import {resetNavigator} from '../constant/commonFun';
import {RESET_STORE} from '../redux/types';
import {useDispatch, useSelector} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import InAppReview from 'react-native-in-app-review';

export function DrawerContent(props) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const renderIcon = (item) => {
    switch (item.iconFamily) {
      case 'FontAwesome5':
        return (
          <FontAwesome5 name={item.icon} color={Colors.darkBlue} size={wp(6)} />
        );
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            name={item.icon}
            color={Colors.darkBlue}
            size={wp(6)}
          />
        );
      case 'Feather':
        return (
          <Feather name={item.icon} color={Colors.darkBlue} size={wp(6)} />
        );
      case 'AntDesign':
        return (
          <AntDesign name={item.icon} color={Colors.darkBlue} size={wp(6)} />
        );
      case 'Ionicons':
        return (
          <Ionicons name={item.icon} color={Colors.darkBlue} size={wp(7)} />
        );
      default:
        break;
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <Ripple
        rippleColor={Colors.darkBlue}
        style={[
          styles.menuView,
          // {borderBottomWidth: SIDE_DRAWER.length - 1 === index ? 0 : 0},
        ]}
        key={index}
        onPress={() => {
          if (item?.navigate === '') {
            InAppReview.RequestInAppReview()
              .then((hasFlowFinishedSuccessfully) => {
                // when return true in android it means user finished or close review flow
                console.log(
                  'InAppReview in android',
                  hasFlowFinishedSuccessfully,
                );

                // when return true in ios it means review flow lanuched to user.
                console.log(
                  'InAppReview in ios has lanuched successfully',
                  hasFlowFinishedSuccessfully,
                );

                // 1- you have option to do something ex: (navigate Home page) (in android).
                // 2- you have option to do something,
                // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

                // 3- another option:
                if (hasFlowFinishedSuccessfully) {
                  // do something for ios
                  // do something for android
                }

                // for android:
                // The flow has finished. The API does not indicate whether the user
                // reviewed or not, or even whether the review dialog was shown. Thus, no
                // matter the result, we continue our app flow.

                // for ios
                // the flow lanuched successfully, The API does not indicate whether the user
                // reviewed or not, or he/she closed flow yet as android, Thus, no
                // matter the result, we continue our app flow.
              })
              .catch((error) => {
                //we continue our app flow.
                // we have some error could happen while lanuching InAppReview,
                // Check table for errors and code number that can return in catch.
                console.log(error);
              });
          } else {
            props.navigation.navigate(item.navigate);
          }
          props.navigation.closeDrawer();
        }}>
        <View style={{width: wp(10)}}>{renderIcon(item)}</View>
        <View
          style={{
            width: wp(50),
          }}>
          <Text style={styles.topText}>{item.topText}</Text>
          <Text style={styles.bottomText}>{item.bottomText}</Text>
        </View>
        <View style={{width: wp(8)}}>
          <MaterialIcons
            name={'keyboard-arrow-right'}
            color={Colors.silver}
            size={hp(3.5)}
          />
        </View>
      </Ripple>
    );
  };
  return (
    <LinearGradient
      colors={[Colors.darkBlue, '#333092']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        flex: 1,
      }}>
      <ImageBackground
        source={require('../assets/images/logo_background.png')}
        style={{height: hp(15), width: '100%', ...STYLES.common}}
        resizeMode={'cover'}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => props.navigation.closeDrawer()}
            style={{
              width: wp(15),
              alignItems: 'flex-end',
              paddingRight: wp(3),
            }}>
            <Feather name={'arrow-left'} color={Colors.white} size={30} />
          </Pressable>
          <View style={styles.profilePhoto}>
            <Image
              source={{uri: userData?.avatar + '?' + new Date()}}
              style={{height: '100%', width: '100%'}}
              resizeMode={'contain'}
            />
          </View>
          <View style={{width: wp(35), paddingLeft: wp(2)}}>
            <Text numberOfLines={1} style={styles.userText}>
              {userData?.fname} {userData?.lname}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.white,
                fontFamily: 'Gilroy-SemiBold',
                fontSize: wp(3.6),
                marginTop: 5,
              }}>
              {userData?.phone}
            </Text>
          </View>
          <View style={{width: wp(15)}}>
            <Pressable
              style={styles.logoutWrapper}
              onPress={() => {
                dispatch({
                  type: RESET_STORE,
                });
                resetNavigator(props, 'Login');
              }}>
              <MaterialIcons
                name={'logout'}
                color={Colors.white}
                size={wp(6)}
              />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={SIDE_DRAWER}
          renderItem={renderItem}
        />
        <View>
          <Text
            style={{
              color: Colors.inputTextColor,
              marginLeft: wp(3),
              marginVertical: wp(3),
              fontSize: wp(3.1),
              fontFamily: 'Gilroy-Regular',
              textAlign: 'center',
              letterSpacing: 1,
            }}>
            App Version: v{DeviceInfo.getReadableVersion()}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profilePhoto: {
    height: wp(15),
    width: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...STYLES.common,
  },
  profileText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.darkBlue,
    fontSize: wp(6),
  },
  logoutWrapper: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#5643A7',
    ...STYLES.common,
  },
  userText: {
    color: Colors.white,
    fontFamily: 'Gilroy-SemiBold',
    fontSize: wp(4),
  },
  bottomView: {
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingTop: wp(3),
    flex: 1,
  },
  menuView: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderColor: Colors.silver,
    paddingVertical: 20,
    marginHorizontal: wp(3),
    alignItems: 'center',
  },
  topText: {
    fontFamily: 'Gilroy-SemiBold',
    color: Colors.darkBlue,
    fontSize: wp(4),
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.3),
    marginTop: 3,
  },
});
