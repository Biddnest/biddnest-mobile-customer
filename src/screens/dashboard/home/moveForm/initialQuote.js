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
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {STYLES} from '../../../../constant/commonStyle';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InitialQuote = (props) => {
  const [offerType, setOfferType] = useState(0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Text
        style={{
          fontFamily: 'Roboto-Italic',
          fontSize: wp(3.5),
          color: '#99A0A5',
          textAlign: 'center',
          marginHorizontal: wp(6),
        }}>
        Please note that this is the baseline price, you will be receiving the
        Vendor bid list with the final quotations
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: wp(5),
          justifyContent: 'space-between',
        }}>
        {[1, 2].map((item, index) => {
          return (
            <Pressable
              style={styles.inputForm}
              onPress={() => setOfferType(index)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4),
                    color: Colors.inputTextColor,
                    marginRight: 5,
                  }}>
                  Economy
                </Text>
                <Ionicons
                  name={'information-circle'}
                  size={25}
                  color={'#DEE6ED'}
                />
              </View>
              <View
                style={{
                  borderRadius: wp(15),
                  borderColor: index === offerType ? Colors.btnBG : Colors.grey,
                  height: wp(30),
                  width: wp(30),
                  borderWidth: 2,
                  marginVertical: hp(2),
                  ...STYLES.common,
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4.7),
                    color:
                      index === offerType
                        ? Colors.btnBG
                        : Colors.inputTextColor,
                  }}>
                  Rs. 2,300
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Light',
                    fontSize: wp(4),
                    color:
                      index === offerType
                        ? Colors.btnBG
                        : Colors.inputTextColor,
                    marginTop: 5,
                  }}>
                  Base price
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Roboto-Italic',
                  fontSize: wp(3.5),
                  color: '#99A0A5',
                  textAlign: 'center',
                }}>
                Economy services includes moving only
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'PLACE ORDER'}
          onPress={() => {}}
          spaceBottom={0}
          width={wp(90)}
        />
        <Button
          width={wp(90)}
          backgroundColor={Colors.white}
          label={'REJECT'}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};

export default InitialQuote;

const styles = StyleSheet.create({
  inputForm: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
    width: wp(42),
    alignItems: 'center',
  },
  arrowView: {
    height: hp(6.5),
    width: hp(6.5),
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.btnBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: hp(60),
    width: wp(100),
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
