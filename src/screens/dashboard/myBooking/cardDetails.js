import {Colors, hp, wp} from '../../../constant/colors';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
import {STYLES} from '../../../constant/commonStyle';
import DropDownAndroid from '../../../components/dropDown';
import TextInput from '../../../components/textInput';
import Button from '../../../components/button';
import DatePicker from 'react-native-datepicker';
import Entypo from 'react-native-vector-icons/Entypo';

const CardDetails = (props) => {
  const [selectedCard, setSelectedCard] = useState(0);
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
          <LinearGradient
            colors={[Colors.darkBlue, '#462F97']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              borderRadius: 10,
              height: hp(6),
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
          <View>
            <Text
              style={{
                marginVertical: hp(1),
                fontFamily: 'Roboto-Medium',
                color: Colors.inputTextColor,
              }}>
              Saved Cards
            </Text>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3, 4, 5]}
            bounces={false}
            renderItem={({item, index}) => {
              return (
                <View style={styles.inputForm} key={index}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable
                      style={styles.radioOuterView}
                      onPress={() => setSelectedCard(index)}>
                      {selectedCard === index ? (
                        <View style={styles.radioInnerView} />
                      ) : null}
                    </Pressable>
                    <View style={styles.flexHeader}>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Medium',
                          fontSize: wp(3.8),
                          color: Colors.inputTextColor,
                        }}>
                        XXXX XXXX XXXX 4231
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Regular',
                          fontSize: wp(2.7),
                          color: Colors.inputTextColor,
                        }}>
                        Credit Card
                      </Text>
                    </View>
                  </View>
                  {selectedCard === index ? (
                    <View>
                      <View style={{marginLeft: 20, marginTop: hp(1)}}>
                        <DropDownAndroid
                          width={wp(75)}
                          label={'Bank Name'}
                          items={[
                            {label: 'Male', value: 'male'},
                            {label: 'Female', value: 'female'},
                          ]}
                          onChangeItem={(text) => {}}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: hp(1),
                          }}>
                          <View style={{width: '45%', marginHorizontal: wp(3)}}>
                            <Text
                              style={{
                                fontFamily: 'Roboto-Bold',
                                color: Colors.textLabelColor,
                                fontSize: wp(4),
                              }}>
                              Valid Until
                            </Text>
                            <View
                              style={{
                                marginTop: hp(1),
                                marginBottom: hp(3),
                                borderWidth: 2,
                                // paddingHorizontal: 15,
                                borderRadius: 10,
                                height: hp(6),
                                borderColor: Colors.silver,
                                backgroundColor: Colors.white,
                              }}>
                              <DatePicker
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}
                                date={new Date()}
                                mode="date"
                                placeholder="select date"
                                format="MM/yy"
                                minDate={new Date()}
                                // maxDate={new Date()}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconComponent={
                                  <Entypo
                                    name={'calendar'}
                                    size={25}
                                    color={Colors.inputTextColor}
                                    style={{
                                      position: 'absolute',
                                      right: 8,
                                      top: 7,
                                      marginLeft: 0,
                                    }}
                                  />
                                }
                                customStyles={{
                                  dateInput: {
                                    borderWidth: 0,
                                    height: hp(6),
                                    marginTop: 1,
                                    width: '100%',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingHorizontal: 15,
                                  },
                                  dateText: {
                                    fontSize: wp(4),
                                    backgroundColor: Colors.textBG,
                                    color: Colors.inputTextColor,
                                    justifyContent: 'flex-start',
                                  },
                                }}
                                onDateChange={(date) => {
                                  // handleState('DOB', date);
                                }}
                              />
                            </View>
                          </View>
                          <View style={{width: wp(30)}}>
                            <TextInput
                              label={'CVV'}
                              placeHolder={'123'}
                              onChange={(text) => {}}
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Button
                          onPress={() => alert('Razor pay')}
                          label={'PROCEED'}
                          width={wp(50)}
                          spaceBottom={hp(1.5)}
                          spaceTop={hp(0.1)}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputForm: {
    paddingVertical: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginBottom: hp(2),
  },
  radioOuterView: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.darkBlue,
    ...STYLES.common,
  },
  radioInnerView: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.darkBlue,
  },
  flexHeader: {
    marginLeft: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});
