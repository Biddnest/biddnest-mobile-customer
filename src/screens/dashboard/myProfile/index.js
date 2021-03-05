import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet, Platform,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import {HomeHeader} from '../home';
import {STYLES} from '../../../constant/commonStyle';

const MyProfile = (props) => {
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
            <Text style={styles.profileText}>DJ</Text>
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
              <Text style={styles.bodyText}>David</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>Last Name</Text>
              <Text style={styles.bodyText}>Jerome</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Email ID</Text>
            <Text style={styles.bodyText}>davidjerome@gmail.com</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Phone Number</Text>
            <Text style={styles.bodyText}>9739912345</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Gender</Text>
            <Text style={styles.bodyText}>Male</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>Date of Birth</Text>
            <Text style={styles.bodyText}>23 Dec 20</Text>
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
    ...STYLES.common,
  },
  profileText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.darkBlue,
    fontSize: wp(10),
  },
  headerText: {
    fontFamily: 'Roboto-Light',
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
