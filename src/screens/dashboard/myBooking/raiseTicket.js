import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import {Colors, hp, wp} from '../../../constant/colors';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import LinearGradient from 'react-native-linear-gradient';
import TextInput from '../../../components/textInput';
import Button from '../../../components/button';
import {useSelector} from 'react-redux';
import SelectionModalAndroid from '../../../components/selectionModal';

const RaiseTicket = (props) => {
  const public_booking_id = props?.route?.params?.public_booking_id || null;
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.ticket?.type) || {};
  const [isLoading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const [data, setData] = useState({
    public_booking_id: '',
    category: '',
    heading: '',
    desc: '',
  });
  const [error, setError] = useState({
    public_booking_id: undefined,
    category: undefined,
    heading: undefined,
    desc: undefined,
  });
  let dropdownDefault = [];
  useEffect(() => {
    if (!public_booking_id) {
      let obj = {
        url: 'tickets/bookings',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          setLoading(false);
          if (res?.data?.status === 'success') {
            let temp = [];
            res?.data?.data?.bookings.forEach((item) => {
              temp.push({
                label: item?.public_booking_id,
                value: item?.public_booking_id,
              });
            });
            setBookingList(temp);
          } else {
            CustomAlert(res?.data?.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          CustomConsole(err);
        });
    }
  }, []);
  Object.keys(configData).forEach((item, index) => {
    dropdownDefault.push({
      label: item.split('_').join(' '),
      value: Object.values(configData)[index],
    });
  });
  if (bookingList.findIndex((item) => item.value === null) === -1) {
    bookingList.unshift({
      label: '-Select-',
      value: null,
    });
  }
  if (dropdownDefault.findIndex((item) => item.value === null) === -1) {
    dropdownDefault.unshift({
      label: '-Select-',
      value: null,
    });
  }
  return (
    <View style={styles.container}>
      <SimpleHeader
        headerText={'Raise Ticket'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <LinearGradient
        colors={[Colors.pageBG, Colors.white]}
        style={{flex: 1, padding: wp(5), alignItems: 'center'}}>
        {!public_booking_id && (
          <SelectionModalAndroid
            style={{
              marginBottom: hp(3),
              borderColor:
                error?.public_booking_id === false ? 'red' : Colors.silver,
            }}
            width={wp(90)}
            value={data?.public_booking_id}
            label={'Choose Booking *'}
            items={bookingList}
            onChangeItem={(text) => setData({...data, public_booking_id: text})}
          />
        )}
        <SelectionModalAndroid
          style={{
            marginBottom: hp(3),
            borderColor: error?.category === false ? 'red' : Colors.silver,
          }}
          width={wp(90)}
          value={data?.category}
          label={'Category *'}
          items={dropdownDefault}
          onChangeItem={(text) => {
            setData({...data, category: text});
          }}
        />
        <TextInput
          isRight={error?.heading}
          label={'Subject *'}
          placeHolder={'Subject'}
          value={data?.heading}
          placeholderStyle={{color: 'red'}}
          onChange={(text) => setData({...data, heading: text})}
        />
        {(error?.heading === false && (
          <Text style={styles.errorText}>Minimun 6 character required</Text>
        )) ||
          null}
        <TextInput
          isRight={error?.desc}
          label={'Description *'}
          placeHolder={'Description'}
          numberOfLines={8}
          height={hp(20)}
          value={data?.desc}
          onChange={(text) => setData({...data, desc: text})}
        />
        {error?.desc === false && (
          <Text style={styles.errorText}>Minimun 15 character required</Text>
        )}
        <Button
          label={'SUBMIT'}
          isLoading={isLoading}
          onPress={() => {
            setLoading(true);
            let tempError = {};
            if (!public_booking_id) {
              tempError.public_booking_id = !!(
                data?.public_booking_id !== '' &&
                data?.public_booking_id != null
              );
            }
            tempError.category = !!(data?.category !== '');
            tempError.heading = !(!data?.heading || data?.heading.length < 6);
            tempError.desc = !(!data?.desc || data?.desc.length < 15);
            setError(tempError);
            if (
              Object.values(tempError).findIndex((item) => item === false) ===
              -1
            ) {
              let obj = {
                url: 'tickets/create',
                method: 'post',
                headers: {
                  Authorization:
                    'Bearer ' + STORE.getState().Login?.loginData?.token,
                },
                data: {
                  ...data,
                  public_booking_id: public_booking_id
                    ? public_booking_id
                    : data?.public_booking_id,
                },
              };
              APICall(obj)
                .then((res) => {
                  setLoading(false);
                  if (res?.data?.status === 'success') {
                    CustomAlert('Ticket Raised Successfully');
                    props.navigation.goBack();
                  } else {
                    CustomAlert(res?.data?.message);
                  }
                })
                .catch((err) => {
                  setLoading(false);
                  CustomConsole(err);
                });
            } else {
              setLoading(false);
            }
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default RaiseTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  errorText: {
    position: 'relative',
    top: Platform.OS === 'android' ? -hp(3) : -hp(1),
    alignSelf: 'flex-end',
    right: wp(5),
    color: Colors.red,
    fontSize: wp(3.5),
    fontFamily: 'Roboto-Regular',
  },
});
