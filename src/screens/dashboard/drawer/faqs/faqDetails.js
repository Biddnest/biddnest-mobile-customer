import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import SimpleHeader from '../../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {STORE} from '../../../../redux';
import {APICall} from '../../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../../constant/commonFun';
import {Html5Entities} from 'html-entities';

const FAQDetails = (props) => {
  const entities = new Html5Entities();
  const category = props?.route?.params?.category || '';
  const [openArray, setOpenArray] = useState([0]);
  const [faqQue, setFaqQue] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    let obj = {
      url: `faq/categories/${category}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setFaqQue(res?.data?.data?.faqs);
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
    return (
      <Pressable
        onPress={() => {
          let temp = [...openArray];
          if (openArray.includes(index)) {
            const indexT = temp.indexOf(index);
            if (indexT > -1) {
              temp.splice(indexT, 1);
            }
          } else {
            temp.push(index);
          }
          setOpenArray(temp);
        }}
        style={styles.inputForm}
        key={index}>
        <View style={styles.flexBox}>
          <Text style={styles.topText}>
            {index + 1}. {entities.decode(item?.title)}
          </Text>
          <View>
            <MaterialCommunityIcons
              name={openArray.includes(index) ? 'minus' : 'plus'}
              size={hp(3.5)}
              color={'#9A9FA4'}
            />
          </View>
        </View>
        {openArray.includes(index) && (
          <View>
            <View style={styles.separatorView} />
            <Text style={styles.bottomText}>{entities.decode(item?.desc)}</Text>
          </View>
        )}
      </Pressable>
    );
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'FAQS'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <View style={{flex: 1, marginBottom: wp(5)}}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          onRefresh={fetchData}
          refreshing={isLoading}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={faqQue || []}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text
              style={{
                fontFamily: 'Roboto-Italic',
                fontSize: wp(3.5),
                color: '#99A0A5',
                textAlign: 'center',
                marginHorizontal: 20,
                marginVertical: hp(5),
              }}>
              No FAQs here!
            </Text>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default FAQDetails;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
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
    marginVertical: hp(1.5),
  },
  topText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    width: '90%',
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.6),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
