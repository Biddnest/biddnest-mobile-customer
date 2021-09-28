import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {
  ArrayUnique,
  CustomAlert,
  CustomConsole,
  ImageSelection,
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
import {STYLES} from '../../../constant/commonStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCross from '../../../assets/svg/image_cross.svg';
import Ripple from 'react-native-material-ripple';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomModalAndroid from '../../../components/customModal';

const RaiseTicket = (props) => {
  const public_booking_id = props?.route?.params?.public_booking_id || null;
  const category = props?.route?.params?.category || null;
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.ticket?.type) || {};
  const [isLoading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const [imageSelect, setImageSelect] = useState(false);
  const [data, setData] = useState({
    public_booking_id: null,
    category: '',
    heading: '',
    desc: '',
    images: [],
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

  const setImage = (type) => {
    let imageData = [...data?.images];
    ImageSelection(type, true)
      .then((res) => {
        let array3 = ArrayUnique(imageData.concat(res));
        setData({
          ...data,
          images: array3,
        });
      })
      .catch((err) => {});
  };
  let imageData = ArrayUnique([...data?.images]);
  imageData.push('Plus');
  return (
    <View style={styles.container}>
      <SimpleHeader
        headerText={'Raise Ticket'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.pageBG, Colors.white]}
          style={{flex: 1, padding: wp(5), alignItems: 'center'}}>
          {category !== 4 && !public_booking_id && (
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
              onChangeItem={(text) =>
                setData({...data, public_booking_id: text})
              }
            />
          )}
          {category !== 4 && (
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
          )}
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
          <View style={styles.inputForm}>
            <Text style={STYLES.textHeader}>UPLOAD PHOTOS</Text>
            <View style={{marginTop: hp(3)}}>
              <FlatList
                bounces={false}
                numColumns={4}
                showsHorizontalScrollIndicator={false}
                data={imageData}
                extraData={imageData}
                keyExtractor={(item, index) => index.toString()}
                style={{
                  paddingHorizontal: wp(5),
                  paddingBottom: hp(1),
                }}
                contentContainerStyle={{justifyContent: 'space-evenly'}}
                renderItem={({item, index}) => {
                  if (item === 'Plus') {
                    return (
                      <Pressable
                        onPress={() => setImageSelect(true)}
                        style={[STYLES.common, STYLES.imageWrapper]}>
                        <MaterialCommunityIcons
                          name={'plus'}
                          size={hp(5)}
                          color={Colors.white}
                        />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable
                      key={index}
                      style={[
                        STYLES.imageWrapper,
                        {
                          backgroundColor: Colors.silver,
                        },
                      ]}>
                      <Image
                        source={{uri: item}}
                        resizeMode={'contain'}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: wp(3),
                        }}
                      />
                      <Pressable
                        onPress={() => {
                          let t1 = [...data.images];
                          t1.splice(index, 1);
                          setData({
                            ...data,
                            images: t1,
                          });
                        }}
                        style={STYLES.crossView}>
                        <ImageCross width={18} height={18} />
                      </Pressable>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
          <Button
            label={'SUBMIT'}
            isLoading={isLoading}
            onPress={() => {
              setLoading(true);
              let tempError = {};
              if (
                (data?.category === 3 || data?.category === 2) &&
                !public_booking_id
              ) {
                tempError.public_booking_id = !!(
                  data?.public_booking_id !== '' &&
                  data?.public_booking_id != null
                );
              } else {
                tempError.public_booking_id = true;
              }
              tempError.category =
                category !== 4 ? data?.category !== '' : true;
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
                    category: category === 4 ? category : data?.category,
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
      </ScrollView>
      <CustomModalAndroid
        visible={imageSelect}
        title={'Upload From'}
        onPress={() => {
          setImageSelect(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: hp(3),
            width: wp(100),
          }}>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              style={[STYLES.selectionView, STYLES.common]}
              onPress={() => setImage('camera')}>
              <Ionicons name={'camera'} color={Colors.darkBlue} size={hp(6)} />
            </Ripple>
            <Text
              style={[
                STYLES.selectionText,
                {
                  textAlign: 'center',
                },
              ]}>
              Camera
            </Text>
          </View>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              onPress={() => setImage('gallery')}
              style={[STYLES.selectionView, STYLES.common]}>
              <AntDesign
                name={'picture'}
                color={Colors.darkBlue}
                size={hp(6)}
              />
            </Ripple>
            <Text
              style={[
                STYLES.selectionText,
                {
                  textAlign: 'center',
                },
              ]}>
              Gallery
            </Text>
          </View>
        </View>
      </CustomModalAndroid>
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
  inputForm: {
    marginHorizontal: wp(5),
    width: wp(85),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
});
