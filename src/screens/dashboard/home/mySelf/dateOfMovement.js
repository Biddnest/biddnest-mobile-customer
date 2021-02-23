import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import Calendar from 'react-native-calendar/components/Calendar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../../../components/customModal';

const DateOfMovement = (props) => {
  const [openCalender, setCalender] = useState(false);
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
        <CustomModal visible={false}>
          <Calendar
            // currentMonth={'2015-08-01'} // Optional date to set the currently displayed month after initialization
            customStyle={{
              day: {fontSize: 15, textAlign: 'center'},
              currentDayCircle: {
                backgroundColor: Colors.darkBlue,
              },
              dayHeading: {
                color: Colors.darkBlue,
              },
            }}
            dayHeadings={Array} // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            events={[{date: '2015-07-01'}]} // Optional array of event objects with a date property and custom styles for the event indicator
            monthNames={Array} // Defaults to english names of months
            nextButtonText={'Next'} // Text for next button. Default: 'Next'
            // onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
            // onDateLongPress={(date) => this.onDateLongPress(date)} // Callback after date is long pressed
            // onSwipeNext={this.onSwipeNext} // Callback for forward swipe event
            // onSwipePrev={this.onSwipePrev} // Callback for back swipe event
            // onTouchNext={this.onTouchNext} // Callback for next touch event
            // onTouchPrev={this.onTouchPrev} // Callback for prev touch event
            // onTitlePress={this.onTitlePress} // Callback on title press
            prevButtonText={'Prev'} // Text for previous button. Default: 'Prev'
            removeClippedSubviews={false} // Set to false for us within Modals. Default: true
            // renderDay={<CustomDay />} // Optionally render a custom day component
            scrollEnabled={true} // False disables swiping. Default: False
            selectedDate={'2015-08-15'} // Day to be selected
            showControls={true} // False hides prev/next buttons. Default: False
            showEventIndicators={true} // False hides event indicators. Default:False
            startDate={'2015-08-01'} // The first month that will display. Default: current month
            titleFormat={'MMMM YYYY'} // Format for displaying current month. Default: 'MMMM YYYY'
            today={new Date()} // Defaults to today
            weekStart={1} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
          />
        </CustomModal>
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
