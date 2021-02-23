import React, {useState, useCallback} from 'react';
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
import FlatButton from '../../../../components/flatButton';
import {ImageSelection} from '../../../../constant/commonFun';
import CloseIcon from '../../../../components/closeIcon';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Slider from 'rn-range-slider';

const RequirementDetails = (props) => {
  const [roomType, setRoomType] = useState(1);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false,
  );
  const [low, setLow] = useState(250);
  const [high, setHigh] = useState(750);
  const [itemData, setItemData] = useState({});
  const [fetchedData, setFetchedData] = useState([
    {
      title: 'Table',
      desc: 'Medium, Acrylic',
    },
    {
      title: 'Chairs',
      desc: 'Large, Polycarbonate',
    },
    {
      title: 'Desk',
      desc: 'Medium, Acrylic',
    },
  ]);

  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);
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
          width: '95%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            color: Colors.inputTextColor,
            fontSize: wp(4),
          }}>
          {item.title}
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
              {item.desc}
            </Text>
          </View>
          {(props.movementType === 'Office' && (
            <View
              style={{
                width: '28%',
                flexDirection: 'row',
                height: hp(4),
                backgroundColor: Colors.silver,
                borderRadius: 5,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.inputTextColor,
                }}>
                100-2000
              </Text>
            </View>
          )) || (
            <View
              style={{
                width: '28%',
                flexDirection: 'row',
                height: hp(4),
                backgroundColor: Colors.silver,
                borderRadius: 5,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Pressable
                onPress={() => {
                  let temp = [...fetchedData];
                  let data = temp[index];
                  if (data?.count > 0) {
                    data.count = data?.count - 1 || 0;
                    setFetchedData(temp);
                  }
                }}>
                <MaterialCommunityIcons
                  name={'minus'}
                  size={18}
                  color={Colors.inputTextColor}
                />
              </Pressable>
              <Text
                style={{
                  color: Colors.inputTextColor,
                }}>
                {item?.count || 0}
              </Text>
              <Pressable
                onPress={() => {
                  let temp = [...fetchedData];
                  let data = temp[index];
                  data.count = data?.count + 1 || 0;
                  setFetchedData(temp);
                }}>
                <MaterialCommunityIcons
                  name={'plus'}
                  size={18}
                  color={Colors.inputTextColor}
                />
              </Pressable>
            </View>
          )}

          <View
            style={{
              width: '28%',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <Pressable
              onPress={() => {
                setConfirmationModalVisible(false);
                setEditItem(true);
              }}
              style={{
                ...styles.backgroundCircle,
                ...STYLES.common,
              }}>
              <SimpleLineIcons
                name={'pencil'}
                size={18}
                color={Colors.darkBlue}
              />
            </Pressable>
            <View
              style={{
                ...styles.backgroundCircle,
                ...STYLES.common,
              }}>
              <Ionicons name={'trash'} size={20} color={Colors.darkBlue} />
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      {props.movementType === 'Residential' && (
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
                  borderColor:
                    roomType === item ? Colors.darkBlue : Colors.white,
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
      )}
      <View style={styles.inputForm}>
        <Text style={[STYLES.textHeader, {textTransform: 'uppercase'}]}>
          {props.movementType === 'Residential'
            ? `${roomType} BHK ITEM LIST`
            : `${props.movementType} ITEM LIST`}
        </Text>
        <View style={{marginTop: hp(3)}}>
          <FlatList
            data={fetchedData}
            extraData={fetchedData}
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
            ListEmptyComponent={() => (
              <Text
                style={{
                  fontFamily: 'Roboto-Italic',
                  fontSize: wp(3.5),
                  color: '#99A0A5',
                  textAlign: 'center',
                  marginHorizontal: 20,
                }}>
                Add Item and give us your requirements and we will get best
                quote for you
              </Text>
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
              onPress={() => ImageSelection()}
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
          onPress={() => {
            setConfirmationModalVisible(true);
          }}
        />
      </View>
      <CustomModal visible={confirmationModalVisible}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
          }}>
          <Text>CONFIRM ITEM LIST</Text>
          <CloseIcon
            onPress={() => {
              setConfirmationModalVisible(false);
            }}
            style={{}}
          />
        </View>
        <View
          style={{
            borderWidth: 0.8,
            borderColor: Colors.silver,
            width: '90%',
            marginVertical: hp(2),
          }}
        />
        <View style={{width: wp(90)}}>
          <FlatList
            data={fetchedData}
            extraData={fetchedData}
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
        </View>
        <View
          style={{
            flex: 1,
            height: hp(6),
            flexDirection: 'row',
            width: wp(100),
            marginTop: hp(4),
          }}>
          <Pressable
            onPress={() => setConfirmationModalVisible(false)}
            style={{
              flex: 1,
              borderWidth: 3,
              borderColor: Colors.btnBG,
              ...STYLES.common,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.btnBG,
                fontSize: wp(3.5),
              }}>
              CANCEL
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (props.bookingFor === 'Others') {
                props.onPageChange(4);
              } else {
                props.onPageChange(3);
              }
            }}
            style={{flex: 1, backgroundColor: Colors.btnBG, ...STYLES.common}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.white,
                fontSize: wp(3.5),
              }}>
              CONFIRM
            </Text>
          </Pressable>
        </View>
      </CustomModal>
      <CustomModal visible={itemModalVisible || editItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
          }}>
          <Text>{editItem ? 'EDIT ITEM' : 'ADD ITEM'}</Text>
          <CloseIcon
            onPress={() => {
              setItemModalVisible(false);
              setEditItem(false);
            }}
            style={{}}
          />
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
          {(props.movementType !== 'Residential' && (
            <View
              style={{
                // width: Platform.OS === 'android' ? wp(56) : wp(57),
                marginTop: hp(2),
                marginHorizontal: wp(3),
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  color: Colors.textLabelColor,
                  fontSize: wp(4),
                }}>
                Quantity
              </Text>

              <Slider
                style={{
                  width: wp(87),
                  alignSelf: 'center',
                  marginTop: hp(4),
                  marginBottom: hp(1),
                  justifyContent: 'flex-end',
                }}
                min={0}
                max={1000}
                step={1}
                floatingLabel
                renderThumb={() => <View style={styles.silderThumb} />}
                renderRail={() => (
                  <View
                    style={{
                      ...styles.sliderRail,
                      width: '100%',
                      borderColor: '#EEE5FC',
                    }}
                  />
                )}
                renderRailSelected={() => <View style={styles.sliderRail} />}
                renderLabel={(value) => (
                  <Text style={styles.sliderLabel}>{value}</Text>
                )}
                onValueChanged={handleValueChange}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: hp(2),
                }}>
                <Text style={styles.sliderText}>0</Text>
                <Text style={styles.sliderText}>1000</Text>
              </View>
            </View>
          )) || (
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
          )}
        </View>
        <FlatButton
          onPress={() => {
            setItemData({});
            setItemModalVisible(false);
          }}
          label={editItem ? 'SAVE' : 'ADD ITEM'}
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
  backgroundCircle: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    backgroundColor: '#EFEFF3',
  },
  sliderRail: {
    borderWidth: 2,
    borderColor: Colors.darkBlue,
    height: 2,
  },
  silderThumb: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#C6DFFA',
  },
  sliderText: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  sliderLabel: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: Colors.white,
    borderRadius: 3,
    overflow: 'hidden',
  },
});
