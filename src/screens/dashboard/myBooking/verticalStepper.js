import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import moment from 'moment';

const VerticalStepper = (props) => {
  const {orderDetails} = props;
  const stepHeader = (title) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.dotView} />
        <Text style={styles.stepHeaderText}>{title}</Text>
      </View>
    );
  };
  return (
    <View style={{marginHorizontal: wp(8), marginVertical: hp(2)}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={[
            styles.dotView,
            {
              backgroundColor:
                orderDetails?.status <= 5 ? '#9E9DC9' : Colors.darkBlue,
            },
          ]}
        />
        <Text
          style={[
            styles.stepHeaderText,
            {
              opacity: orderDetails?.status <= 5 ? 0.8 : 1,
            },
          ]}>
          {'Driver Assigned'}
        </Text>
      </View>
      <View
        style={{
          ...styles.stepBodyView,
        }}>
        <Text
          style={[
            styles.subHeaderText,
            {
              opacity: orderDetails?.status <= 5 ? 0.8 : 1,
            },
          ]}>
          {orderDetails?.status <= 5
            ? 'Pending'
            : 'Completed at ' +
              moment(
                orderDetails?.status_history?.find((item) => item.status == 5)
                  ?.created_at,
              ).format('MMMM Do YYYY, h:mm A')}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={[
            styles.dotView,
            {
              backgroundColor:
                orderDetails?.status <= 6 ? '#9E9DC9' : Colors.darkBlue,
            },
          ]}
        />
        <Text
          style={[
            styles.stepHeaderText,
            {
              opacity: orderDetails?.status <= 6 ? 0.8 : 1,
            },
          ]}>
          {'Awaiting pickup'}
        </Text>
      </View>
      <View
        style={{
          ...styles.stepBodyView,
        }}>
        <Text
          style={[
            styles.subHeaderText,
            {
              opacity: orderDetails?.status <= 6 ? 0.8 : 1,
            },
          ]}>
          {orderDetails?.status <= 6
            ? 'Pending'
            : 'Completed at ' +
              moment(
                orderDetails?.status_history?.find((item) => item.status == 6)
                  ?.created_at,
              ).format('MMMM Do YYYY, h:mm A')}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={[
            styles.dotView,
            {
              backgroundColor:
                orderDetails?.status === 8 ? Colors.darkBlue : '#9E9DC9',
            },
          ]}
        />
        <Text
          style={[
            styles.stepHeaderText,
            {
              opacity: orderDetails?.status === 8 ? 1 : 0.8,
            },
          ]}>
          {orderDetails?.status === 8 ? 'Completed' : 'In Transit'}
        </Text>
      </View>
      <View
        style={{
          ...styles.stepBodyView,
          borderLeftWidth: 0,
          paddingBottom: 0,
        }}>
        <Text
          style={[
            styles.subHeaderText,
            {
              opacity: orderDetails?.status === 8 ? 1 : 0.8,
            },
          ]}>
          {orderDetails?.status < 7
            ? 'Pending'
            : orderDetails?.status === 7
            ? 'On Going'
            : 'Completed at ' +
              moment(
                orderDetails?.status_history?.find((item) => item.status == 8)
                  ?.created_at,
              ).format('MMMM Do YYYY, h:mm A')}
        </Text>
      </View>
    </View>
  );
};

export default VerticalStepper;

const styles = StyleSheet.create({
  dotView: {
    height: hp(2.6),
    width: hp(2.6),
    borderRadius: hp(1.3),
    backgroundColor: Colors.darkBlue,
  },
  stepHeaderText: {
    fontFamily: 'Gilroy-SemiBold',
    color: Colors.darkBlue,
    fontSize: wp(4),
    marginLeft: wp(2.5),
    textTransform: 'uppercase',
  },
  stepBodyView: {
    borderLeftWidth: 1,
    borderColor: Colors.darkBlue,
    marginLeft: wp(2),
    paddingLeft: wp(5),
    paddingBottom: hp(3),
  },
  inputForm: {
    paddingVertical: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginVertical: hp(1),
  },
  subHeaderText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    color: Colors.darkBlue,
    // textTransform: 'capitalize',
  },
});
