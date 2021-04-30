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
import CloseIcon from '../../../../components/closeIcon';
import {STYLES} from '../../../../constant/commonStyle';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DateOfMovement = (props) => {
  const {data, handleStateChange} = props;
  const [openCalender, setCalender] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [dateArray, setDateArray] = useState({});
  const [dateArrayDisplay, setDateArrayDisplay] = useState([]);
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
          DATE OF MOVEMENT
        </Text>
        <View style={{marginTop: hp(3)}}>
          <Text
            style={{
              fontFamily: 'Roboto-Italic',
              fontSize: wp(3.3),
              color: '#99A0A5',
              textAlign: 'center',
            }}>
            If you have a fixed date of movement in mind opt for “Specific Date”
            else you can chose a range of dates.
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
                    size={hp(1.5)}
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
            placeholder={'Choose Date'}
            disabled={true}
            label={'Choose Date'}
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
              height: hp(6.5),
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
        <CustomModalAndroid
          visible={openCalender}
          onPress={() => {
            setCalender(false);
          }}>
          <Text style={STYLES.modalHeader}>Choose Date</Text>
          <CloseIcon
            onPress={() => {
              setDefaultSelectedDates();
              setCalender(false);
            }}
          />
          <Calendar
            markedDates={dateArray}
            style={{width: wp(90), height: hp(50)}}
            current={new Date()}
            minDate={date.setDate(date.getDate() + 1)}
            maxDate={date.setDate(date.getDate() + 13)}
            onDayPress={(day) => {
              let temp = {...dateArray};
              if (day.dateString in temp) {
                delete temp[day.dateString];
              } else {
                temp[day.dateString] = {
                  selected: true,
                  selectedColor: Colors.btnBG,
                };
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
              handleStateChange('movement_dates', Object.keys(dateArray));
              let temp = [];
              Object.keys(dateArray).forEach((item) => {
                temp.push(moment(item).format('Do MMM'));
              });
              setDateArrayDisplay(temp);
              setCalender(false);
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: Colors.darkBlue,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginRight: hp(1.3),
  },
  closeView: {
    position: 'absolute',
    height: hp(2),
    width: hp(2),
    backgroundColor: Colors.darkBlue,
    right: -hp(1),
    top: -hp(1),
    borderRadius: hp(1),
  },
});
