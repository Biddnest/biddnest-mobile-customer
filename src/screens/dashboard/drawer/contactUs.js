import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {Colors, hp, SIDE_DRAWER, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {STYLES} from '../../../constant/commonStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/button';

const ContactUs = (props) => {
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
            Not able to reschedule order{' '}
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
              }}>
              #123456
            </Text>
          </Text>
          <Text
            style={{
              ...styles.locationText,
              marginTop: 0,
              fontFamily: 'Roboto-Light',
              fontSize: wp(3.8),
            }}>
            31 Jan
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
            Not able to reschedule order which I placed last Week and now I want
            to move the date…
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
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.inputForm}>
          <Text style={styles.headerText}>recent order</Text>
          <View style={styles.separatorView} />
          <View>
            <View style={styles.flexBox}>
              <Text style={{...styles.locationText, marginTop: 0}}>
                CHENNAI
              </Text>
              <Text style={{...styles.locationText, marginTop: 0}}>
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
                marginTop: hp(1.5),
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
                <Ionicons name={'call'} color={Colors.darkBlue} size={wp(4)} />
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
              data={[1, 2]}
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
          <Image
            source={require('../../../assets/images/home_call.png')}
            resizeMode={'contain'}
            style={{height: 55, width: 55}}
          />
        </View>
        <View style={{alignSelf: 'center'}}>
          <Button
            width={wp(90)}
            backgroundColor={Colors.white}
            label={''}
            spaceBottom={0.1}
            onPress={() => {}}
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
