import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import Button from '../../../components/button';
import {STYLES} from '../../../constant/commonStyle';
import TextInput from '../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModalAndroid from '../../../components/customModal';
import DropDownAndroid from '../../../components/dropDown';
import CheckBox from '../../../components/checkBox';
import FlatButton from '../../../components/flatButton';
import CloseIcon from '../../../components/closeIcon';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import LocationDistance from '../../../components/locationDistance';

const FinalQuote = (props) => {
  const [rejectVisible, setRejectVisible] = useState(false);
  const [isAgree, setAgree] = useState(true);

  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'FINAL QUOTE'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <LocationDistance onEditClick={() => {}} />
          <View style={styles.inputForm}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerText}>FINAL BIDDING IS HERE</Text>
            </View>
            <View style={styles.circleView}>
              <Text style={styles.priceText}>Rs. 2,300</Text>
              <Text style={styles.priceLabel}>Base price</Text>
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: wp(4),
                color: Colors.inputTextColor,
              }}>
              Premium
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text
                  style={[
                    styles.leftText,
                    {
                      textTransform: 'uppercase',
                    },
                  ]}>
                  vehicle type
                </Text>
                <Text
                  style={[
                    styles.leftText,
                    {
                      textTransform: 'uppercase',
                    },
                  ]}>
                  man power
                </Text>
              </View>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={[styles.leftText]}>Movers Truck</Text>
                <Text style={styles.leftText}>05</Text>
              </View>
            </View>
          </View>
          <View style={styles.checkBoxView}>
            <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
            <Text
              style={{
                color: Colors.grey,
                fontSize: wp(3.8),
              }}>
              I agree to the Terms & conditions
            </Text>
          </View>
          <View
            style={[
              styles.inputForm,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <Image
              source={require('../../../assets/images/coupon.png')}
              style={{height: wp(10), width: wp(10), marginLeft: 10}}
              resizeMode={'contain'}
            />
            <Text
              style={{
                width: wp(70),
                marginLeft: 10,
                fontFamily: 'Roboto-Italic',
                fontSize: wp(3.5),
                color: '#99A0A5',
              }}>
              use coupon code{' '}
              <Text
                style={{
                  color: Colors.btnBG,
                }}>
                “NEW2021”
              </Text>{' '}
              to avail 20% off on your first order. Tap to copy code.
            </Text>
          </View>
          <View style={styles.btnWrapper}>
            <Button
              width={wp(43)}
              backgroundColor={Colors.white}
              label={'REJECT'}
              onPress={() => setRejectVisible(true)}
            />
            <Button
              label={'ACCEPT'}
              onPress={() => props.navigation.navigate('Payment')}
              spaceBottom={0}
              width={wp(43)}
            />
          </View>
          <CustomModalAndroid
            visible={rejectVisible}
            onPress={() => setRejectVisible(false)}>
            <CloseIcon
              onPress={() => setRejectVisible(false)}
              style={{
                position: 'absolute',
                right: 15,
                top: Platform.OS === 'android' ? -4 : -10,
              }}
            />
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: Colors.inputTextColor,
                fontSize: wp(3.5),
              }}>
              REASON FOR REJECTION
            </Text>
            <DropDownAndroid
              label={''}
              width={wp(90)}
              items={[{label: 'High Price', value: 'highprice'}]}
              onChangeItem={(text) => {}}
            />
            <View style={{width: wp(90)}}>
              <TextInput
                label={''}
                placeHolder={'Enter your expected price here'}
                numberOfLines={4}
                onChange={(text) => {}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: Colors.inputTextColor,
                  fontSize: wp(3.8),
                }}>
                Talk to our agent
              </Text>
            </View>
            <FlatButton label={'CANCEL BOOKING'} />
          </CustomModalAndroid>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default FinalQuote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputForm: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
    marginHorizontal: hp(2),
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginRight: 5,
  },
  circleView: {
    borderRadius: wp(15),
    borderColor: Colors.btnBG,
    height: wp(30),
    width: wp(30),
    borderWidth: 3,
    marginVertical: hp(2),
    ...STYLES.common,
  },
  priceText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.7),
    color: Colors.btnBG,
  },
  priceLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(4),
    color: Colors.btnBG,
    marginTop: 5,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  btnWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginTop: hp(2),
  },
  rightText: {},
});
