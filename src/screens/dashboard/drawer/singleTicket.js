import React, {useEffect, useRef, useState} from 'react';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import LinearGradient from 'react-native-linear-gradient';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {STYLES} from '../../../constant/commonStyle';
import moment from 'moment';
import FlatButton from '../../../components/flatButton';
import {useSelector} from 'react-redux';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import CustomModalAndroid from '../../../components/customModal';
import TextInput from '../../../components/textInput';
import Button from '../../../components/button';

const SingleTicket = (props) => {
  const flatlistRef = useRef(null);
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const [ticket, setTicket] = useState(props?.route?.params?.ticket || {});
  const [isLoading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState('');
  const [replyError, setReplyError] = useState(undefined);
  const [repliesModal, setRepliesModal] = useState(false);
  const ticketStatus =
    useSelector((state) => state.Login?.configData?.enums?.ticket?.status) ||
    {};
  let status = '';
  Object.values(ticketStatus).forEach((i, ind) => {
    if (i === ticket.status) {
      status = Object.keys(ticketStatus)[ind];
    }
  });
  useEffect(() => {
    fetchReplies();
  }, []);
  const fetchReplies = () => {
    setLoading(true);
    let obj = {
      url: `tickets/details?id=${ticket?.id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setReplies(res?.data?.data?.ticket?.reply);
          setTicket(res?.data?.data?.ticket);
          flatlistRef?.current?.scrollToEnd();
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  };
  const renderItem = ({item, index}) => {
    if (item?.admin_id) {
      return (
        <View key={index} style={{flexDirection: 'row'}}>
          <View
            style={[
              styles.profileView,
              STYLES.common,
              {backgroundColor: Colors.darkBlue},
            ]}>
            <Text
              style={{
                textTransform: 'uppercase',
                color: Colors.white,
              }}>
              {item?.admin?.fname?.slice(0, 1)}
              {item?.admin?.lname?.slice(0, 1)}
            </Text>
          </View>
          <View
            style={[
              styles.messageWrapper,
              {
                width: wp(67),
              },
            ]}>
            <Text style={styles.userText}>{item?.admin?.fname}</Text>
            <Text style={styles.timeText}>
              {moment(item?.created_at).fromNow()}
            </Text>
            <Text style={styles.messageText}>{item?.chat}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            width: wp(90),
            justifyContent: 'flex-end',
          }}>
          <View
            style={[
              styles.messageWrapper,
              {
                marginLeft: 0,
                marginRight: wp(1),
                backgroundColor: Colors.silver,
                width: wp(67),
              },
            ]}>
            <Text style={[styles.userText, {textAlign: 'right'}]}>You</Text>
            <Text style={[styles.timeText, {textAlign: 'right'}]}>
              {moment(item?.created_at).fromNow()}
            </Text>
            <Text style={styles.messageText}>{item?.chat}</Text>
          </View>
          <View style={styles.profileView}>
            <Image
              source={{uri: userData?.avatar + '?' + new Date()}}
              style={{height: '100%', width: '100%'}}
              resizeMode={'contain'}
            />
          </View>
        </View>
      );
    }
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={`Ticket id #${ticket?.id}`}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <View
        style={{
          flex: 1,
          paddingBottom: ticket?.status === ticketStatus?.open ? hp(8) : wp(4),
        }}>
        <View style={styles.inputForm}>
          <View style={styles.flexBox}>
            <Text style={styles.locationText}>{ticket?.heading}</Text>
            <View
              style={{
                backgroundColor:
                  ticketStatus?.open === ticket?.status ||
                  ticketStatus?.resolved === ticket?.status
                    ? Colors.lightGreen
                    : Colors.error,
                paddingHorizontal: wp(3),
                paddingVertical: hp(1),
                borderRadius: hp(2),
                ...STYLES.common,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: wp(3.8),
                  fontFamily: 'Gilroy-SemiBold',
                  textTransform: 'capitalize',
                }}>
                {status}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.flexBox,
              marginTop: hp(1.5),
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Light',
                fontSize: wp(3.8),
                color: Colors.inputTextColor,
              }}>
              {ticket?.desc}
            </Text>
          </View>
          <Text
            style={{
              color: Colors.inputTextColor,
              marginTop: 0,
              fontFamily: 'Roboto-Light',
              fontSize: wp(3.8),
              textAlign: 'right',
            }}>
            {moment(ticket?.created_at).format('D MMM')}
          </Text>
        </View>
        <Text style={styles.repliesText}>Replies</Text>
        {replies?.length === 0 && (
          <Text
            style={{
              fontFamily: 'Roboto-Italic',
              fontSize: wp(3.5),
              color: '#99A0A5',
              textAlign: 'center',
              marginHorizontal: 20,
            }}>
            No replies yet
          </Text>
        )}
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            ref={flatlistRef}
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
            showsVerticalScrollIndicator={false}
            data={replies}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separatorView} />}
          />
        </View>
      </View>
      {ticket?.status === ticketStatus?.open && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: wp(100),
          }}>
          <FlatButton
            label={'ADD REPLY'}
            onPress={() => setRepliesModal(true)}
          />
        </View>
      )}
      <CustomModalAndroid
        visible={repliesModal}
        title={'REPLY'}
        onPress={() => setRepliesModal(false)}>
        <View
          style={{
            width: '90%',
            marginVertical: hp(2),
          }}>
          <TextInput
            isRight={replyError}
            placeHolder={'Reply'}
            label={''}
            numberOfLines={4}
            onChange={(text) => setReply(text)}
            value={reply}
          />
        </View>
        <Button
          isLoading={isLoading}
          spaceTop={hp(0.1)}
          label={'SUBMIT'}
          onPress={() => {
            // API for reply
            if (reply !== '') {
              setReplyError(true);
              let obj = {
                url: 'tickets/reply',
                method: 'post',
                headers: {
                  Authorization:
                    'Bearer ' + STORE.getState().Login?.loginData?.token,
                },
                data: {
                  ticket_id: ticket?.id,
                  reply: reply,
                },
              };
              APICall(obj)
                .then((res) => {
                  setLoading(false);
                  if (res?.data?.status === 'success') {
                    fetchReplies();
                    setRepliesModal(false);
                  } else {
                    CustomAlert(res?.data?.message);
                  }
                })
                .catch((err) => {
                  setLoading(false);
                  CustomConsole(err);
                });
            } else {
              setReplyError(false);
            }
          }}
        />
      </CustomModalAndroid>
    </LinearGradient>
  );
};

export default SingleTicket;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: wp(5),
  },
  locationText: {
    color: Colors.inputTextColor,
    marginTop: 0,
    fontSize: wp(3.8),
    fontFamily: 'Roboto-Medium',
    width: '70%',
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    textTransform: 'uppercase',
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
    textAlign: 'center',
    marginTop: hp(1),
  },
  repliesText: {
    fontSize: wp(4),
    color: Colors.textLabelColor,
    fontFamily: 'Gilroy-SemiBold',
    margin: wp(5),
  },
  separatorView: {
    height: hp(2),
  },
  userText: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
  },
  timeText: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: wp(3),
    color: Colors.inputTextColor,
  },
  messageText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginTop: 7,
  },
  messageWrapper: {
    backgroundColor: Colors.white,
    // marginTop: wp(4),
    marginLeft: wp(1),
    maxWidth: wp(79),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DEE6ED',
    padding: wp(3),
  },
  profileView: {
    height: wp(10),
    width: wp(10),
    backgroundColor: Colors.silver,
    borderRadius: wp(5),
    overflow: 'hidden',
  },
});
