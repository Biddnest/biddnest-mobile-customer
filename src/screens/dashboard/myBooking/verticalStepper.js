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
      {stepHeader('Driver Assigned')}
      <View
        style={{
          ...styles.stepBodyView,
        }}>
        <Text style={styles.subHeaderText}>
          {orderDetails?.status <= 7
            ? 'Pending'
            : 'Completed at ' +
              moment(
                orderDetails?.status_history?.find((item) => item.status == 6)
                  ?.created_at,
              ).format('MMMM Do YYYY, h:mm A')}
        </Text>
      </View>
      {stepHeader('Awaiting pickup')}
      <View
        style={{
          ...styles.stepBodyView,
        }}>
        <Text style={styles.subHeaderText}>
          {orderDetails?.status <= 5
            ? 'Pending'
            : 'Completed at ' +
              moment(
                orderDetails?.status_history?.find((item) => item.status == 7)
                  ?.created_at,
              ).format('MMMM Do YYYY, h:mm A')}
        </Text>
      </View>
      {stepHeader(orderDetails?.status === 8 ? 'Completed' : 'In Transit')}
      <View
        style={{
          ...styles.stepBodyView,
          borderLeftWidth: 0,
          paddingBottom: 0,
        }}>
        <Text style={styles.subHeaderText}>
          {orderDetails?.status < 8
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
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.darkBlue,
  },
  stepHeaderText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.darkBlue,
    fontSize: wp(4),
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  stepBodyView: {
    borderLeftWidth: 1,
    borderColor: Colors.darkBlue,
    marginLeft: 10,
    paddingLeft: 20,
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
