import React, {useState} from 'react';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, hp, wp, PAYMENT_OPTION} from '../../../constant/colors';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import DropDownAndroid from '../../../components/dropDown';
import Button from '../../../components/button';
import AddNewCard from './addNewCard';
import UPIPayment from './UPIPayment';
import NetBanking from './netBanking';

const Payment = (props) => {
  const [addCardVisible, setCardVisible] = useState(false);
  const [UPIVisible, setUPIVisible] = useState(false);
  const [netBankingVisible, setNetBankingVisible] = useState(false);

  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'PAYMENT'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1, padding: hp(2)}}>
          <Text>Payment Summary</Text>
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>Item Total</Text>
            <Text style={styles.leftText}>3900</Text>
          </View>
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>Texes and charges</Text>
            <Text style={styles.leftText}>100</Text>
          </View>
          <View style={styles.separatorView} />
          <View style={styles.flexBox}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalText}>4000</Text>
          </View>
          <View style={{width: wp(96), alignSelf: 'center'}}>
            <TextInput
              label={''}
              placeHolder={'Enter Coupon Code if any'}
              onChange={(text) => {}}
            />
          </View>
          <LinearGradient
            colors={[Colors.darkBlue, '#462F97']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              borderRadius: 10,
              height: hp(6.5),
              backgroundColor: Colors.darkBlue,
              ...STYLES.common,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: wp(4),
                fontFamily: 'Roboto-Regular',
              }}>
              Total Price{' '}
              <Text
                style={{
                  fontSize: wp(5.5),
                  fontFamily: 'Roboto-Bold',
                }}>
                RS. 4000
              </Text>
            </Text>
          </LinearGradient>
          <FlatList
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            data={PAYMENT_OPTION}
            bounces={false}
            style={{marginTop: hp(2)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <View style={styles.movementLinear} key={index}>
                  <Pressable
                    onPress={() => {
                      if (item.name === 'UPI Payment') {
                        setUPIVisible(true);
                      } else if (item.name === 'Net Banking') {
                        setNetBankingVisible(true);
                      } else {
                        props.navigation.navigate('CardDetails');
                      }
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: wp(30),
                    }}>
                    {item.image}
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.inputTextColor,
                        fontSize: wp(3.8),
                        marginTop: 10,
                      }}>
                      {item.name}
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />
          <Button
            spaceTop={hp(1)}
            width={wp(90)}
            backgroundColor={Colors.white}
            label={'USE ANOTHER CARD'}
            onPress={() => setCardVisible(true)}
          />
        </ScrollView>
      </View>
      <AddNewCard
        visible={addCardVisible}
        onCloseIcon={() => setCardVisible(false)}
      />
      <UPIPayment
        visible={UPIVisible}
        onCloseIcon={() => setUPIVisible(false)}
      />
      <NetBanking
        visible={netBankingVisible}
        onCloseIcon={() => setNetBankingVisible(false)}
      />
    </LinearGradient>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  totalText: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
  },
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.silver,
    backgroundColor: Colors.white,
  },
});
