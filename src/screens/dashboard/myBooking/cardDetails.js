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
import DropDown from '../../../components/dropDown';
import TextInput from '../../../components/textInput';
import Button from '../../../components/button';

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
            data={[1, 2]}
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
                        <DropDown
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
                          <View style={{width: wp(45)}}>
                            <TextInput
                              label={'Valid Until'}
                              placeHolder={'To City'}
                              onChange={(text) => {}}
                            />
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
