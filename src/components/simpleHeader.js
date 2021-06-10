import React, {useState} from 'react';
import {Image, Pressable, View, Text, StyleSheet, Linking} from 'react-native';
import {boxShadow, Colors, hp, wp} from '../constant/colors';
import BackArrow from '../assets/svg/back_arrow.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {STYLES} from '../constant/commonStyle';
import ChatBot from '../assets/svg/chat_bot.svg';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import CustomModalAndroid from './customModal';
import Entypo from 'react-native-vector-icons/Entypo';
import {Freshchat} from 'react-native-freshchat-sdk';

const SimpleHeader = (props) => {
  const navigation = useNavigation();
  const configData =
    useSelector((state) => state.Login?.configData?.contact_us?.details) || '';
  let data = JSON.parse(configData.toString());
  const [openModal, setOpenModal] = useState(false);
  return (
    <View
      style={[
        boxShadow,
        {
          height: hp(7.5),
          backgroundColor: Colors.white,
          flexDirection: 'row',
        },
      ]}>
      <Pressable
        style={{
          width: wp(13),
          height: '100%',
          ...styles.common,
        }}
        onPress={() => {
          props.onBack();
        }}>
        {(props.closeIcon && (
          <Ionicons name="close-sharp" size={hp(3.5)} color={Colors.black} />
        )) || <BackArrow width={wp(20)} height={hp(20)} />}
      </Pressable>
      <View style={{width: wp(74), height: '100%', ...styles.common}}>
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: wp(5),
            color: Colors.inputTextColor,
            textTransform: 'capitalize',
          }}>
          {props.headerText}
        </Text>
      </View>
      <Pressable
        style={{...STYLES.common, width: wp(13)}}
        onPress={() => {
          navigation.navigate('ContactUs');
        }}>
        <ChatBot width={hp(6.5)} height={hp(6.5)} />
      </Pressable>
      <CustomModalAndroid
        visible={openModal}
        title={'Support'}
        onPress={() => setOpenModal(false)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: hp(3),
            width: wp(100),
          }}>
          <View style={styles.common}>
            <Pressable
              style={[STYLES.selectionView, STYLES.common]}
              onPress={() => {
                setOpenModal(false);
                data?.contact_no?.length > 0 &&
                  Linking.openURL(`tel:${data?.contact_no[0]}`);
              }}>
              <Ionicons name={'call'} color={Colors.darkBlue} size={hp(6)} />
            </Pressable>
            <Text style={STYLES.selectionText}>Call</Text>
          </View>
          <View style={styles.common}>
            <Pressable
              onPress={() => {
                setOpenModal(false);
                Freshchat.showConversations();
              }}
              style={[STYLES.selectionView, STYLES.common]}>
              <Entypo name={'chat'} color={Colors.darkBlue} size={hp(6)} />
            </Pressable>
            <Text style={STYLES.selectionText}>Chat</Text>
          </View>
        </View>
      </CustomModalAndroid>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
