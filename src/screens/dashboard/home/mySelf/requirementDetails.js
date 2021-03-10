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
import {boxShadow, Colors, hp, wp} from '../../../../constant/colors';
import Button from '../../../../components/button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {STYLES} from '../../../../constant/commonStyle';
import TextInput from '../../../../components/textInput';
import CustomModalAndroid from '../../../../components/customModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownAndroid from '../../../../components/dropDown';
import FlatButton from '../../../../components/flatButton';
import {ImageSelection, pad_with_zeroes} from '../../../../constant/commonFun';
import CloseIcon from '../../../../components/closeIcon';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Slider from 'rn-range-slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import OrderDetailModal from '../../myBooking/orderDetailModal';
import ImageCross from '../../../../assets/svg/image_cross.svg';
import CustomLabel from './CustomLabel';

const RequirementDetails = (props) => {
  const [roomType, setRoomType] = useState(1);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false,
  );
  const [multiSliderValue, setMultiSliderValue] = React.useState([250, 750]);
  const [data, setData] = useState({});
  const [low, setLow] = useState(250);
  const [high, setHigh] = useState(750);
  const [itemData, setItemData] = useState({
    quantity: 1,
  });
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
  const multiSliderValuesChange = (values) => setMultiSliderValue(values);

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
          <View style={{width: '38%', marginRight: '2%'}}>
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
            bounces={false}
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
                  <View
                    style={{
                      position: 'absolute',
                      right: -4,
                      top: -4,
                      height: 18,
                      width: 18,
                    }}>
                    <ImageCross width={18} height={18} />
                  </View>
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
      <CustomModalAndroid visible={confirmationModalVisible}>
        <OrderDetailModal
          title={'CONFIRM ITEM LIST'}
          onCloseIcon={() => setConfirmationModalVisible(false)}
          leftOnPress={() => setConfirmationModalVisible(false)}
          rightOnPress={() => {
            if (props.bookingFor === 'Others') {
              props.onPageChange(4);
            } else {
              props.onPageChange(3);
            }
          }}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={itemModalVisible || editItem}
        onPress={() => {
          setItemModalVisible(false);
          setEditItem(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '85%',
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
            width: '85%',
            marginVertical: hp(2),
          }}
        />
        <DropDownAndroid
          label={'Item Name'}
          width={wp(90)}
          items={[{label: 'TV', value: 'tv'}]}
          onChangeItem={(text) => {}}
        />
        <View style={{flexDirection: 'row', marginTop: hp(2)}}>
          <DropDownAndroid
            label={'Material'}
            items={[{label: 'Polycarbonate', value: 'polycarbonate'}]}
            onChangeItem={(text) => {}}
          />
          <DropDownAndroid
            label={'Size'}
            items={[
              {label: 'Small', value: 'small'},
              {label: 'Medium', value: 'medium'},
              {label: 'Large', value: 'large'},
            ]}
            onChangeItem={(text) => {}}
          />
        </View>
        <View style={{width: '90%'}}>
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
              <MultiSlider
                values={[multiSliderValue[0], multiSliderValue[1]]}
                sliderLength={wp(85)}
                onValuesChange={multiSliderValuesChange}
                selectedStyle={{backgroundColor: Colors.darkBlue}}
                unselectedStyle={{backgroundColor: '#F5E3FF'}}
                min={0}
                max={1000}
                step={1}
                allowOverlap
                snapped
                enableLabel={true}
                customMarker={() => (
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: Colors.white,
                      borderColor: '#B6DFFF',
                      borderWidth: 0.8,
                      ...boxShadow,
                    }}
                  />
                )}
                customLabel={CustomLabel}
              />
              {/*<Slider*/}
              {/*  style={{*/}
              {/*    width: wp(85),*/}
              {/*    alignSelf: 'center',*/}
              {/*    marginTop: hp(4),*/}
              {/*    marginBottom: hp(1),*/}
              {/*    justifyContent: 'flex-end',*/}
              {/*  }}*/}
              {/*  min={0}*/}
              {/*  max={1000}*/}
              {/*  step={1}*/}
              {/*  floatingLabel*/}
              {/*  renderThumb={() => <View style={styles.sliderThumb} />}*/}
              {/*  renderRail={() => (*/}
              {/*    <View*/}
              {/*      style={{*/}
              {/*        ...styles.sliderRail,*/}
              {/*        width: '100%',*/}
              {/*        borderColor: '#EEE5FC',*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*  renderRailSelected={() => <View style={styles.sliderRail} />}*/}
              {/*  renderLabel={(value) => (*/}
              {/*    <Text style={styles.sliderLabel}>{value}</Text>*/}
              {/*  )}*/}
              {/*  onValueChanged={handleValueChange}*/}
              {/*/>*/}
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
                width: Platform.OS === 'android' ? wp(60) : wp(57),
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(2),
              }}>
              <TextInput
                label={'Quantity'}
                // isRight={error.firstName}
                placeHolder={'Quantity'}
                value={pad_with_zeroes(itemData?.quantity, 2).toString()}
                onChange={(text) => handleItemState('quantity', text)}
              />
              <Pressable
                style={styles.arrowView}
                onPress={() => {
                  if (parseInt(itemData.quantity) - 1 > 0) {
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
      </CustomModalAndroid>
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
  sliderThumb: {
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
