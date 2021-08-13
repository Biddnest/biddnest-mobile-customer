import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModalAndroid from '../../../../components/customModal';
import {Calendar} from 'react-native-calendars';
import FlatButton from '../../../../components/flatButton';
import {STYLES} from '../../../../constant/commonStyle';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import {CustomAlert} from '../../../../constant/commonFun';
import Switch from '../../../../components/switch';
import InformationPopUp from '../../../../components/informationPopUp';

const DateOfMovement = (props) => {
  const {data, handleStateChange} = props;
  const [openCalender, setCalender] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [dateArray, setDateArray] = useState({});
  const [dateArrayDisplay, setDateArrayDisplay] = useState([]);
  const [sharedInfo, setSharedInfo] = useState(false);
  let source = data?.source || {};
  let date = new Date();

  useEffect(() => {
    setDefaultSelectedDates();
    dateFormat();
  }, [data]);

  const dateFormat = () => {
    let temp = [];
    data?.movement_dates?.forEach((item) => {
      temp.push(moment(item).format('Do MMM'));
    });
    setDateArrayDisplay(temp);
  };

  const setDefaultSelectedDates = () => {
    let temp = {};
    data.movement_dates.forEach((item) => {
      temp[item] = {
        selected: true,
        selectedColor: Colors.btnBG,
      };
    });
    setDateArray(temp);
  };

  const handleState = (key, value) => {
    let temp = {...source};
    temp.meta[key] = value;
    handleStateChange('source', temp);
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.inputForm}>
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: wp(3.5),
            color: Colors.inputTextColor,
            textAlign: 'center',
          }}>
          Choose a Date
        </Text>
        <View style={{marginTop: hp(3), width: '90%', alignSelf: 'center'}}>
          <Text
            style={{
              fontFamily: 'Roboto-Italic',
              fontSize: wp(3.3),
              color: '#99A0A5',
              // textAlign: 'center',
            }}>
            You can choose a Fixed date/Range of dates/Multiple dates to fix
            your movement.{'\n'}
            Fixed date – You can choose a fixed date for the movement. {'\n'}
            Multiple dates – You can choose 5 different dates for the movement.
            {'\n'}
            Range of dates – You can choose preferable range of dates for the
            movement (15 days maximum)
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(2),
            flexWrap: 'wrap',
            width: '90%',
            alignSelf: 'center',
          }}>
          {(dateArrayDisplay || data?.movement_dates)?.map((item, index) => {
            return (
              <View style={styles.categoryView} key={index}>
                <Pressable
                  onPress={() => {
                    let temp = [...data?.movement_dates];
                    temp.splice(index, 1);
                    handleStateChange('movement_dates', temp);
                  }}
                  style={{
                    ...styles.closeView,
                    ...STYLES.common,
                  }}>
                  <Ionicons
                    name="close-sharp"
                    size={hp(2)}
                    color={Colors.white}
                  />
                </Pressable>
                <Text
                  style={{
                    color: Colors.inputTextColor,
                    fontSize: wp(3.8),
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
        <Pressable
          style={{marginTop: hp(1.5)}}
          onPress={() => setCalender(true)}>
          <Input
            placeholder={'Choose a Date'}
            disabled={true}
            label={'Choose a Date *'}
            value={
              dateArrayDisplay?.join(', ') || data?.movement_dates?.join(', ')
            }
            rightIcon={() => {
              return (
                <MaterialIcons
                  name="calendar-today"
                  size={hp(3)}
                  color={Colors.grey}
                />
              );
            }}
            inputContainerStyle={{
              borderWidth: 2,
              paddingHorizontal: 15,
              borderRadius: 10,
              height: hp(6),
              marginTop: hp(1),
              borderColor: error ? Colors.red : Colors.silver,
              borderBottomWidth: 2,
            }}
            labelStyle={{
              fontFamily: 'Roboto-Bold',
              color: Colors.textLabelColor,
              fontSize: wp(4),
            }}
            inputStyle={{
              fontSize: wp(4),
              backgroundColor: Colors.textBG,
              color: Colors.inputTextColor,
              height: '99%',
            }}
          />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: wp(3),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: wp(52),
            }}>
            <Pressable onPress={() => setSharedInfo(true)}>
              <Ionicons
                name={'information-circle'}
                size={hp(3.5)}
                color={'#99A0A5'}
              />
            </Pressable>
            <Text
              style={{
                color:
                  source?.meta?.shared_service === true ||
                  source?.meta?.shared_service == 1
                    ? Colors.textLabelColor
                    : '#99A0A5',
                fontFamily: 'Roboto-Bold',
                fontSize: wp(4),
                marginLeft: 5,
              }}>
              I would prefer shared Service.
            </Text>
          </View>
          <Switch
            onChange={(text) => handleState('shared_service', text === 1)}
            value={source?.meta?.shared_service || false}
          />
        </View>
        <Text
          style={{
            color: '#99A0A5',
            marginTop: 10,
            fontFamily: 'Roboto-Italic',
            fontSize: wp(3.5),
            marginHorizontal: wp(3),
            textAlign: 'center',
          }}>
          If you prefer, we will efficiently move your things in a shared
          vehicle cost effectively
        </Text>
        <InformationPopUp
          visible={sharedInfo}
          label={
            'If checked, our vendors will move your items along with other items in a shared vehicle \n\n Checking this option will effectively reduce the movement cost, else A dedicated vehicle will be used.'
          }
          title={'Shared Service'}
          onCloseIcon={() => {
            setSharedInfo(false);
          }}
        />
        <CustomModalAndroid
          visible={openCalender}
          title={'Choose Date'}
          onPress={() => {
            setDefaultSelectedDates();
            setCalender(false);
          }}>
          <Calendar
            markedDates={dateArray}
            style={{width: wp(90), height: hp(50)}}
            current={new Date()}
            minDate={date.setDate(date.getDate() + 1)}
            maxDate={date.setDate(date.getDate() + 20)}
            onDayPress={(day) => {
              let temp = {...dateArray};
              if (day.dateString in temp) {
                delete temp[day.dateString];
              } else {
                if (Object.keys(temp)?.length < 5) {
                  if (Object.keys(temp)?.length === 1) {
                    let a = moment(Object.keys(temp)[0]);
                    let b = moment(day.dateString);
                    let dateDifference = b.diff(a, 'days');
                    if (Math.abs(dateDifference) < 5) {
                      let ary = new Array(Math.abs(dateDifference)).fill('');
                      ary.forEach((item, index) => {
                        if (Math.sign(dateDifference) === -1) {
                          temp[
                            moment(
                              moment(Object.keys(temp)[0]).subtract(
                                index + 1,
                                'days',
                              ),
                            ).format('yyyy-MM-DD')
                          ] = {
                            selected: true,
                            selectedColor: Colors.btnBG,
                          };
                        } else {
                          temp[
                            moment(
                              moment(Object.keys(temp)[0]).add(
                                index + 1,
                                'days',
                              ),
                            ).format('yyyy-MM-DD')
                          ] = {
                            selected: true,
                            selectedColor: Colors.btnBG,
                          };
                        }
                      });
                    } else {
                      temp[day.dateString] = {
                        selected: true,
                        selectedColor: Colors.btnBG,
                      };
                    }
                  } else {
                    temp[day.dateString] = {
                      selected: true,
                      selectedColor: Colors.btnBG,
                    };
                  }
                } else {
                  CustomAlert('You can select maximum 5 dates');
                }
              }
              setDateArray(temp);
            }}
            monthFormat={'MMM yyyy'}
            showWeekNumbers={true}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            enableSwipeMonths={true}
            theme={{
              arrowColor: Colors.btnBG,
            }}
          />
          <FlatButton
            label={'OKAY'}
            onPress={() => {
              let t = _.orderBy(
                Object.keys(dateArray),
                (o: any) => {
                  return moment(o);
                },
                ['asc'],
              );
              if (t.length <= 5) {
                handleStateChange('movement_dates', t);
                let temp = [];
                t.forEach((item) => {
                  temp.push(moment(item).format('Do MMM'));
                });
                setDateArrayDisplay(temp);
                setCalender(false);
              } else {
                let aryLength = t.length;
                let dateDifference = moment(t[aryLength - 1]).diff(
                  moment(t[0]),
                  'days',
                );
                if (aryLength === dateDifference + 1) {
                  handleStateChange('movement_dates', t);
                  let temp = [];
                  t.forEach((item) => {
                    temp.push(moment(item).format('Do MMM'));
                  });
                  setDateArrayDisplay(temp);
                  setCalender(false);
                } else {
                  CustomAlert('You can select maximum 5 dates');
                }
              }
            }}
          />
        </CustomModalAndroid>
      </KeyboardAwareScrollView>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'NEXT'}
          isLoading={isLoading}
          onPress={() => {
            setLoading(true);
            if (data?.movement_dates?.length > 0) {
              setError(false);
              setLoading(false);
              if (props.bookingFor === 'Others') {
                props.onPageChange(3);
              } else {
                props.onPageChange(2);
              }
            } else {
              setLoading(false);
              setError(true);
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default DateOfMovement;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
  },
  categoryView: {
    marginBottom: hp(0.8),
    paddingHorizontal: wp(2),
    paddingVertical: 5,
    borderColor: Colors.darkBlue,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginLeft: hp(1.3),
    alignItems: 'center',
  },
  closeView: {
    position: 'absolute',
    height: hp(2.5),
    width: hp(2.5),
    backgroundColor: Colors.darkBlue,
    right: -hp(1.3),
    top: -hp(1.3),
    borderRadius: hp(12.5),
  },
});
