import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import {HomeHeader} from '../home';
import {STYLES} from '../../../constant/commonStyle';
import {useSelector} from 'react-redux';
import moment from 'moment';

const MyProfile = (props) => {
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <HomeHeader
        navigation={props.navigation}
        title={'MY PROFILE'}
        edit={true}
        onEditPress={() => props.navigation.navigate('EditProfile')}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <ImageBackground
          source={require('../../../assets/images/logo_background.png')}
          style={{height: hp(20), width: '100%', ...STYLES.common}}
          resizeMode={'cover'}>
          <View style={styles.profilePhoto}>
            <Image
              source={{uri: userData?.avatar + '?' + new Date()}}
              style={{height: '100%', width: '100%'}}
              resizeMode={'contain'}
            />
          </View>
        </ImageBackground>
        <View style={{padding: hp(2)}}>
          <View
            style={{
              ...styles.textWrapper,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>First Name</Text>
              <Text style={styles.bodyText}>{userData?.fname}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>Last Name</Text>
              <Text style={styles.bodyText}>{userData?.lname}</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Email ID</Text>
            <Text style={styles.bodyText}>{userData?.email}</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Phone Number</Text>
            <Text style={styles.bodyText}>{userData?.phone}</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Gender</Text>
            <Text style={[styles.bodyText, {textTransform: 'capitalize'}]}>
              {userData.gender}
            </Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Date of Birth</Text>
            <Text style={styles.bodyText}>
              {moment(userData?.dob).format('D MMM yyyy')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  profilePhoto: {
    height: hp(12),
    width: hp(12),
    borderRadius: hp(6),
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...STYLES.common,
  },
  headerText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
    marginBottom: 10,
    marginTop: 5,
  },
  bodyText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4.2),
    color: Colors.inputTextColor,
    marginBottom: 10,
  },
  textWrapper: {
    padding: hp(1),
    borderBottomWidth: 1,
    borderColor: Colors.silver,
  },
});
