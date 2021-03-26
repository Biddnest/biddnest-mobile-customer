import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

const RaiseTicket = (props) => {
  const public_booking_id = props?.route?.params?.public_booking_id || null;
  const [isLoading, setLoading] = useState(false);
  const [heading, setHeading] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState({
    heading: undefined,
    desc: undefined,
  });
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
        <TextInput
          isRight={error?.heading}
          label={'Subject'}
          placeHolder={'Subject'}
          value={heading}
          placeholderStyle={{color: 'red'}}
          onChange={(text) => setHeading(text)}
        />
        <TextInput
          isRight={error?.desc}
          label={'Description'}
          placeHolder={'Description'}
          numberOfLines={8}
          height={hp(20)}
          value={desc}
          onChange={(text) => setDesc(text)}
        />
        <Button
          label={'SUBMIT'}
          isLoading={isLoading}
          onPress={() => {
            setLoading(true);
            let tempError = {};
            tempError.heading = !(!heading || heading.length < 15);
            tempError.desc = !(!desc || desc.length < 50);
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
                  public_booking_id: public_booking_id,
                  heading: heading,
                  desc: desc,
                },
              };
              APICall(obj)
                .then((res) => {
                  if (res?.data?.status === 'success') {
                    props.navigation.goBack();
                  } else {
                    CustomAlert(res?.data?.message);
                  }
                })
                .catch((err) => {
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
});
