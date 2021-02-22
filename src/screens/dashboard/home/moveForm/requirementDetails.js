import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {STYLES} from '../../../../constant/commonStyle';
import TextInput from '../../../../components/textInput';
import CustomModal from '../../../../components/customModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDown from '../../../../components/dropDown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FlatButton from '../../../../components/flatButton';

const RequirementDetails = (props) => {
  const [roomType, setRoomType] = useState(0);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemData, setItemData] = useState({});

  const handleItemState = (key, value) => {
    setItemData({
      ...itemData,
      [key]: value,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          width: '98%',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            color: Colors.inputTextColor,
            fontSize: wp(4),
          }}>
          Table
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: '40%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Roboto-Regular',
                color: Colors.inputTextColor,
                fontSize: wp(3.5),
              }}>
              Medium, Acrylic
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              flexDirection: 'row',
              height: hp(4),
              backgroundColor: Colors.silver,
              borderRadius: 5,
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View>
              <MaterialCommunityIcons
                name={'minus'}
                size={18}
                color={Colors.inputTextColor}
              />
            </View>
            <Text
              style={{
                color: Colors.inputTextColor,
              }}>
              01
            </Text>
            <View>
              <MaterialCommunityIcons
                name={'plus'}
                size={18}
                color={Colors.inputTextColor}
              />
            </View>
          </View>
          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <View>
              <Image
                source={require('../../../../assets/images/edit_pen.png')}
                style={{height: 35, width: 35}}
                resizeMode={'contain'}
              />
            </View>
            <View>
              <Image
                source={require('../../../../assets/images/edit_pen.png')}
                style={{height: 35, width: 35}}
                resizeMode={'contain'}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: wp(5),
        }}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => setRoomType(item)}
              style={{
                height: wp(20),
                width: wp(20),
                borderRadius: wp(10),
                borderWidth: 2,
                borderColor: roomType === item ? Colors.darkBlue : Colors.white,
                backgroundColor: Colors.white,
                marginRight: wp(3),
                ...STYLES.common,
              }}>
              <Text
                style={{
                  fontFamily: 'Gilroy-Light',
                  color: Colors.inputTextColor,
                  fontSize: wp(4),
                }}>
                {item} BHK
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.inputForm}>
        <Text style={STYLES.textHeader}>{roomType} BHK ITEM LIST</Text>
        <View style={{marginTop: hp(3)}}>
          <FlatList
            data={[1, 2, 3]}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderWidth: 0.7,
                  borderColor: Colors.silver,
                  marginVertical: hp(2),
                }}
              />
            )}
          />
          <Button
            label={'ADD ANOTHER ITEM'}
            backgroundColor={Colors.white}
            spaceBottom={0}
            onPress={() => setItemModalVisible(true)}
          />
        </View>
      </View>
      <View style={styles.inputForm}>
        <Text style={STYLES.textHeader}>UPLOAD PHOTOS</Text>
        <View style={{marginTop: hp(3)}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: wp(5),
              paddingVertical: hp(1),
            }}>
            {[1, 2].map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => setRoomType(item)}
                  style={{
                    height: wp(16),
                    width: wp(16),
                    borderRadius: wp(3),
                    backgroundColor: Colors.silver,
                    marginRight: wp(3),
                  }}>
                  <Image
                    source={require('../../../../assets/images/image_cross.png')}
                    resizeMode={'contain'}
                    style={{
                      position: 'absolute',
                      right: -4,
                      top: -4,
                      height: 18,
                      width: 18,
                    }}
                  />
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {}}
              style={{
                height: wp(16),
                width: wp(16),
                borderRadius: wp(3),
                backgroundColor: Colors.btnBG,
                marginRight: wp(3),
                ...STYLES.common,
              }}>
              <MaterialCommunityIcons
                name={'plus'}
                size={35}
                color={Colors.white}
              />
            </Pressable>
          </ScrollView>
        </View>
      </View>
      <View style={styles.inputForm}>
        <Text style={STYLES.textHeader}>COMMENTS IF ANY</Text>
        <TextInput
          label={''}
          placeHolder={'Comments if any'}
          numberOfLines={4}
          onChange={(text) => {}}
        />
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'SHOW QUOTATION'}
          onPress={() => props.onPageChange(3)}
        />
      </View>
      <CustomModal visible={itemModalVisible}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
          }}>
          <Text>ADD ITEM</Text>
          <Pressable onPress={() => setItemModalVisible(false)}>
            <Ionicons name="close-sharp" size={25} color={Colors.silver} />
          </Pressable>
        </View>
        <View
          style={{
            borderWidth: 0.8,
            borderColor: Colors.silver,
            width: '90%',
            marginVertical: hp(2),
          }}
        />
        <DropDown
          label={'Item Name'}
          width={wp(90)}
          items={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
          ]}
          onChangeItem={(text) => handleState('gender', text)}
        />
        <View style={{flexDirection: 'row', marginTop: hp(2)}}>
          <DropDown
            label={'Material'}
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            onChangeItem={(text) => handleState('gender', text)}
          />
          <DropDown
            label={'Size'}
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            onChangeItem={(text) => handleState('gender', text)}
          />
        </View>
        <View style={{width: '95%'}}>
          <View
            style={{
              width: Platform.OS === 'android' ? wp(56) : wp(57),
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(2),
            }}>
            <TextInput
              label={'Quantity'}
              // isRight={error.firstName}
              placeHolder={'Quantity'}
              value={itemData?.quantity?.toString()}
              onChange={(text) => handleItemState('quantity', text)}
            />
            <Pressable
              style={styles.arrowView}
              onPress={() => {
                if (parseInt(itemData.quantity) - 1 >= 0) {
                  handleItemState(
                    'quantity',
                    parseInt(itemData.quantity) - 1 || 0,
                  );
                }
              }}>
              <MaterialCommunityIcons
                name="minus"
                size={30}
                color={Colors.btnBG}
              />
            </Pressable>
            <Pressable
              style={{
                ...styles.arrowView,
                marginLeft: wp(2),
              }}
              onPress={() => {
                handleItemState(
                  'quantity',
                  parseInt(itemData.quantity) + 1 || 0,
                );
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color={Colors.btnBG}
              />
            </Pressable>
          </View>
        </View>
        <FlatButton
          onPress={() => setItemModalVisible(false)}
          label={'ADD ITEM'}
        />
      </CustomModal>
    </ScrollView>
  );
};

export default RequirementDetails;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  arrowView: {
    height: hp(6.5),
    width: hp(6.5),
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.btnBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: hp(60),
    width: wp(100),
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
