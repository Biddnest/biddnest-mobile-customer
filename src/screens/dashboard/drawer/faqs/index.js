import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, View, StyleSheet, Image} from 'react-native';
import {Colors, wp, hp} from '../../../../constant/colors';
import SimpleHeader from '../../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import RightArrow from '../../../../assets/svg/right_arrow.svg';
import {STORE} from '../../../../redux';
import {APICall} from '../../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../../constant/commonFun';

const FAQS = (props) => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    setLoading(true);
    let obj = {
      url: 'faq/categories',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setFaqs(res?.data?.data?.faqs?.categories);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'FAQS'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <View style={{flex: 1, padding: wp(3)}}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          onRefresh={fetchData}
          refreshing={isLoading}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          data={faqs || []}
          bounces={false}
          contentContainerStyle={{justifyContent: 'space-evenly'}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.movementLinear} key={index}>
                <Pressable
                  onPress={() =>
                    props.navigation.navigate('FAQDetails', {
                      category: item?.value,
                    })
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: wp(30),
                  }}>
                  <Image
                    source={{uri: item?.image}}
                    resizeMode={'contain'}
                    style={{height: 50, width: 50}}
                  />
                </Pressable>
                <View style={styles.bottomView}>
                  <Text style={styles.bottomText}>{item.name}</Text>
                  <RightArrow width={20} height={20} />
                </View>
              </View>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default FAQS;

const styles = StyleSheet.create({
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.silver,
    backgroundColor: '#FDFDFD',
  },
  bottomView: {
    height: 40,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: Colors.silver,
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.5),
  },
});
