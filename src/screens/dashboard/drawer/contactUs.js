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
} from 'react-native';
import {Colors, hp, SIDE_DRAWER, wp} from '../../../constant/colors';
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

const ContactUs = (props) => {
  const [recentTicket, setRecentTicket] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetchTicket();
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
    return (
      <View key={index}>
        <View style={styles.flexBox}>
          <Text
            style={{
              ...styles.locationText,
              marginTop: 0,
              fontSize: wp(3.8),
              fontFamily: 'Roboto-Medium',
            }}>
            {item?.heading}
            {/*<Text*/}
            {/*  style={{*/}
            {/*    fontFamily: 'Roboto-Bold',*/}
            {/*  }}>*/}
            {/*  #123456*/}
            {/*</Text>*/}
          </Text>
          <Text
            style={{
              ...styles.locationText,
              marginTop: 0,
              fontFamily: 'Roboto-Light',
              fontSize: wp(3.8),
            }}>
            {moment(item?.created_at).format('D MMM')}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexBox,
            marginTop: hp(1.5),
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
      </View>
    );
  };
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
            <View>
              <View style={[styles.flexBox, {width: wp(70)}]}>
                <Text style={{...styles.locationText, marginTop: 0}}>
                  CHENNAI
                </Text>
                <Text
                  style={{
                    ...styles.locationText,
                    marginTop: 0,
                    textAlign: 'right',
                  }}>
                  ID:{' '}
                  <Text
                    style={{
                      fontFamily: 'Gilroy-Extrabold',
                    }}>
                    #123456
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  ...styles.flexBox,
                  marginTop: hp(1),
                }}>
                <Text style={styles.locationText}>BENGALURU</Text>
                <View
                  style={{
                    height: wp(8),
                    width: wp(8),
                    borderRadius: wp(4),
                    backgroundColor: '#F2E6FF',
                    ...STYLES.common,
                  }}>
                  <Ionicons
                    name={'call'}
                    color={Colors.darkBlue}
                    size={wp(4)}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.inputForm}>
          <Text style={styles.headerText}>RECENT TICKETS</Text>
          <View style={styles.separatorView} />
          <View>
            <FlatList
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
                  fontFamily: 'Gilroy-Regular',
                  fontSize: wp(3.8),
                  marginTop: hp(1),
                },
              ]}>
              Call us at +91-900080000
            </Text>
          </View>
          <HomeCall width={55} height={55} />
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
            label={'REQUEST A CALL BACK'}
            onPress={() => {}}
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
    fontFamily: 'Gilroy-Semibold',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
    textAlign: 'center',
    marginTop: hp(2),
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
