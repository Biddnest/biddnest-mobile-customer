import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
import DropDownAndroid from '../../../components/dropDown';
import {STYLES} from '../../../constant/commonStyle';
import {Picker} from '@react-native-picker/picker';

const RaiseTicket = (props) => {
  const public_booking_id = props?.route?.params?.public_booking_id || null;
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.ticket?.type) || {};
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    category: '',
    heading: '',
    desc: '',
  });
  const [error, setError] = useState({
    category: undefined,
    heading: undefined,
    desc: undefined,
  });
  let dropdownDefault = [];
  Object.keys(configData).forEach((item, index) => {
    dropdownDefault.push({
      label: item.split('_').join(' '),
      value: Object.values(configData)[index],
    });
  });
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
        <View
          style={{
            width: wp(90),
            paddingHorizontal: 10,
            marginBottom: hp(2),
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              color: Colors.textLabelColor,
              fontSize: wp(4),
              marginBottom: hp(1),
            }}>
            {'Category'}
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 10,
              height: hp(6),
              borderColor: error?.category === false ? 'red' : Colors.silver,
              backgroundColor: Colors.white,
              borderBottomWidth: 2,
              ...STYLES.common,
            }}>
            <Picker
              style={{
                height: '99%',
                width: '100%',
              }}
              // selectedValue={editItem ? editData?.name : addData?.name}
              onValueChange={(text) => setData({...data, category: text})}>
              {dropdownDefault.map((item, index) => {
                return <Picker.Item label={item?.label} value={item?.value} />;
              })}
            </Picker>
          </View>
        </View>
        <TextInput
          isRight={error?.heading}
          label={'Subject'}
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
          label={'Description'}
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
                  public_booking_id: public_booking_id,
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
    top: -hp(3),
    alignSelf: 'flex-end',
    right: wp(5),
    color: Colors.red,
    fontSize: wp(3.5),
    fontFamily: 'Roboto-Regular',
  },
});
