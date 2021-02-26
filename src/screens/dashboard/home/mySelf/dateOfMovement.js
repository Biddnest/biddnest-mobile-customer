import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModalAndroid from '../../../../components/customModal';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import FlatButton from '../../../../components/flatButton';

const DateOfMovement = (props) => {
  const [openCalender, setCalender] = useState(false);
  const [dateArray, setDateArray] = useState({});
  return (
    <View>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.inputForm}>
        <Text
          style={{
            fontFamily: 'Gilroy-Light',
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
        <View style={{marginTop: hp(3)}}>
          <Input
            placeholder={'Choose Date'}
            label={'Choose Date'}
            rightIcon={() => {
              return (
                <MaterialIcons
                  name="calendar-today"
                  size={25}
                  color={Colors.grey}
                />
              );
            }}
            onChangeText={() => {}}
            inputContainerStyle={{
              borderWidth: 2,
              paddingHorizontal: 15,
              borderRadius: 10,
              height: hp(6.5),
              marginTop: hp(1),
              borderColor: Colors.silver,
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
            }}
          />
        </View>
        <CustomModalAndroid visible={true}>
          <Calendar
            markedDates={dateArray}
            style={{width: wp(90), height: hp(50)}}
            current={'2021-02-26'}
            // minDate={new Date()}
            onDayPress={(day) => {
              let temp = {...dateArray};
              if (day.dateString in temp) {
                delete temp[day.dateString];
              } else {
                temp[day.dateString] = {selected: true, selectedColor: 'blue'};
              }
              setDateArray(temp);
            }}
            onDayLongPress={(day) => {
              console.log('selected day', day);
            }}
            monthFormat={'MMM yyyy'}
            onMonthChange={(month) => {
              console.log('month changed', month);
            }}
            showWeekNumbers={true}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            // Replace default month and year title with custom one. the function receive a date as parameter.
            // renderHeader={(date) => {
            //   /*Return JSX*/
            // }}
            enableSwipeMonths={true}
          />
          <FlatButton label={'OKAY'} onPress={() => {}} />
        </CustomModalAndroid>
      </KeyboardAwareScrollView>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'NEXT'}
          onPress={() => {
            if (props.bookingFor === 'Others') {
              props.onPageChange(3);
            } else {
              props.onPageChange(2);
            }
          }}
        />
      </View>
    </View>
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
