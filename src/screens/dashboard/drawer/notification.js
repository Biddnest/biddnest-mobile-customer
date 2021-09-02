import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import {STYLES} from '../../../constant/commonStyle';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import moment from 'moment';

const Notification = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setRefresh] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = (pageNo = 1, url) => {
    setRefresh(true);
    let obj = {
      url: url ? url : `notifications?page=${pageNo}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        setRefresh(false);
        if (res?.data?.status === 'success') {
          if (pageNo === 1) {
            setData(res?.data?.data);
          } else if (pageNo !== res?.data?.data?.paging?.current_page) {
            let temp = [
              ...data?.notifications,
              ...res?.data?.data?.notifications,
            ];
            setData({
              notifications: temp,
              paging: res?.data?.data?.paging,
            });
          }
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        setRefresh(false);
        CustomConsole(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        {index !== 0 && <View style={styles.separatorView} />}
        <View
          style={{
            width: wp(82),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                width: wp(55),
                fontFamily: 'Roboto-Bold',
                color: Colors.textLabelColor,
                fontSize: wp(3.8),
              }}>
              {item?.title}
            </Text>
            <Text
              style={{
                width: wp(25),
                fontFamily: 'Roboto-Regular',
                color: Colors.textLabelColor,
                textAlign: 'right',
                fontSize: wp(3),
              }}>
              {moment(item?.created_at).fromNow()}
            </Text>
          </View>
          <Text
            style={{
              marginTop: hp(0.5),
              fontFamily: 'Roboto-Regular',
              color: Colors.textLabelColor,
              fontSize: wp(3.5),
            }}>
            {item?.desc}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.pageBG, Colors.white]}
      style={{flex: 1, paddingBottom: wp(5)}}>
      <SimpleHeader
        headerText={'Notifications'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
        right={true}
        onRightPress={() => {}}
      />
      {isLoading && <LoadingScreen />}
      <View
        style={{
          marginBottom: wp(15),
          ...styles.inputForm,
        }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={data?.notifications || []}
          extraData={data?.notifications}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onRefresh={fetchNotification}
          refreshing={isRefresh}
          onEndReached={() => {
            if (data?.notifications?.length > 8) {
              fetchNotification(
                data?.paging?.current_page || 1,
                data?.paging?.next_page,
              );
            }
          }}
          ListEmptyComponent={() => (
            <Text
              style={{
                fontFamily: 'Roboto-Italic',
                fontSize: hp(1.9),
                color: '#99A0A5',
                textAlign: 'center',
                marginHorizontal: 20,
                marginVertical: hp(5),
              }}>
              No any Notification!
            </Text>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default Notification;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: wp(5),
    paddingBottom: wp(5),
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: hp(1.9),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
});
