import React, {useState, useCallback, useEffect} from 'react';
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
import {
  CustomAlert,
  CustomConsole,
  ImageSelection,
} from '../../../../constant/commonFun';
import CloseIcon from '../../../../components/closeIcon';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import OrderDetailModal from '../../myBooking/orderDetailModal';
import ImageCross from '../../../../assets/svg/image_cross.svg';
import CustomLabel from './CustomLabel';
import {APICall} from '../../../../redux/actions/user';
import {STORE} from '../../../../redux';
import {useSelector} from 'react-redux';

const RequirementDetails = (props) => {
  const {data, handleStateChange, movementType} = props;
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.service) || {};
  const [defaultInventories, setDefaultInventories] = useState(
    useSelector((state) => state.Login?.inventoriesData?.inventories) || [],
  );
  const [isLoading, setLoading] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [addItem, setAddItem] = useState(false);
  const [addData, setAddData] = useState({});
  const [editItem, setEditItem] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false,
  );
  const [error, setError] = useState({
    inventory: undefined,
  });
  const [subServices, setSubServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  console.log(addData);
  const handleState = (key, value) => {
    let temp = {...data.meta};
    if (key === 'remarks') {
      temp.customer[key] = value;
    } else {
      if (key === 'images') {
        let t1 = [...temp.images];
        t1.push(value);
        temp[key] = t1;
      } else {
        temp[key] = value;
      }
    }
    handleStateChange('meta', temp);
  };

  useEffect(() => {
    let inv = [...defaultInventories];
    defaultInventories.forEach((item, index) => {
      let temp = {...item};
      temp.label = temp.name;
      temp.value = temp.name;
      delete temp.icon;
      inv[index] = temp;
    });
    if (JSON.stringify(inv) !== JSON.stringify(defaultInventories)) {
      setDefaultInventories(inv);
      if (inv.length > 0) {
        let temp = {...inv[0]};
        temp.material = JSON.parse(temp.material.toString());
        temp.size = JSON.parse(temp.size.toString());
        let materialAry = [];
        let sizeAry = [];
        temp.material.forEach((item) => {
          materialAry.push({
            label: item,
            value: item,
          });
        });
        temp.size.forEach((item) => {
          sizeAry.push({
            label: item,
            value: item,
          });
        });
        temp.material = materialAry;
        temp.size = sizeAry;
        setSelectedInventory(temp);
      } else {
        setSelectedInventory({});
      }
    }
  }, [defaultInventories]);
  const getInventories = (id) => {
    let obj = {
      url: `inventories?subservice_id=${id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          let temp = [];
          if (res?.data?.data?.inventories?.length > 0) {
            res?.data?.data?.inventories.forEach((item) => {
              temp.push({
                inventory_id: item?.inventory_id,
                material: item?.material,
                size: item?.size,
                quantity:
                  configData?.inventory_quantity_type.range ===
                  movementType?.inventory_quantity_type
                    ? {
                        min: item?.quantity?.min,
                        max: item?.quantity?.max,
                      }
                    : item?.quantity,
                name: item?.meta?.name,
                image: item?.meta?.image,
              });
            });
            setInventoryItems(temp);
            handleStateChange('inventory_items', temp);
          }
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };

  useEffect(() => {
    let obj = {
      url: `subservices?service_id=${movementType?.id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          if (res?.data?.data?.subservices.length > 0) {
            let temp = res?.data?.data?.subservices[0];
            setSelectedSubCategory(temp);
            getInventories(temp.id);
            handleState('subcategory', temp.name);
          }
          setSubServices(res?.data?.data?.subservices || []);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  }, []);

  const handleItemState = (key, value) => {
    setAddData({
      ...addData,
      [key]: value,
    });
  };
  const multiSliderValuesChange = (values) => {
    if (editItem) {
      let temp = {...editData.quantity};
      temp.min = values[0];
      temp.max = values[1];
      setEditData({...editData, quantity: temp});
    } else {
      let temp = {...addData.quantity};
      temp.min = values[0];
      temp.max = values[1];
      setAddData({...addData, quantity: temp});
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        key={item.id}
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
          {item.name}
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
              {item.material}
            </Text>
          </View>
          {(configData?.inventory_quantity_type.range ===
            movementType?.inventory_quantity_type && (
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
                {item?.quantity?.min}-{item?.quantity?.max}
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
                  let temp = [...inventoryItems];
                  let t1 = temp[index];
                  if (t1?.quantity > 1) {
                    t1.quantity = t1?.quantity - 1 || 0;
                    setInventoryItems(temp);
                    handleStateChange('inventory_items', temp);
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
                {item?.quantity || 0}
              </Text>
              <Pressable
                onPress={() => {
                  let temp = [...inventoryItems];
                  let t1 = temp[index];
                  t1.quantity = t1?.quantity + 1 || 0;
                  setInventoryItems(temp);
                  handleStateChange('inventory_items', temp);
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
                setEditData(item);
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
            <Pressable
              onPress={() => {
                let temp = [...inventoryItems];
                temp.splice(index, 1);
                setInventoryItems(temp);
                handleStateChange('inventory_items', temp);
              }}
              style={{
                ...styles.backgroundCircle,
                ...STYLES.common,
              }}>
              <Ionicons name={'trash'} size={20} color={Colors.darkBlue} />
            </Pressable>
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
        {subServices.map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
                handleState('subcategory', item.name);
                getInventories(item.id);
                setSelectedSubCategory(item);
              }}
              style={{
                height: wp(20),
                width: wp(20),
                borderRadius: wp(10),
                borderWidth: 2,
                borderColor:
                  selectedSubCategory.id === item.id
                    ? Colors.darkBlue
                    : Colors.white,
                backgroundColor: Colors.white,
                marginRight: wp(3),
                ...STYLES.common,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Gilroy-Light',
                  color: Colors.inputTextColor,
                  fontSize: wp(4),
                }}>
                {item?.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={[
          styles.inputForm,
          {
            borderColor: error.inventory === false ? Colors.red : '#DEE6ED',
            borderWidth: error.inventory === false ? 2 : 1,
          },
        ]}>
        <Text style={[STYLES.textHeader, {textTransform: 'uppercase'}]}>
          {movementType?.id === 1
            ? `${selectedSubCategory?.id} BHK ITEM LIST`
            : `${movementType?.name} ITEM LIST`}
        </Text>
        <View style={{marginTop: hp(3)}}>
          <FlatList
            bounces={false}
            data={inventoryItems}
            extraData={inventoryItems}
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
            onPress={() => {
              setAddData({
                name:
                  defaultInventories.length > 0
                    ? defaultInventories[0].name
                    : '',
                material:
                  defaultInventories.length > 0
                    ? JSON.parse(defaultInventories[0].material.toString())[0]
                    : '',
                size: 'small',
                quantity:
                  configData?.inventory_quantity_type.range ===
                  movementType?.inventory_quantity_type
                    ? {
                        min: 250,
                        max: 750,
                      }
                    : 1,
              });
              setAddItem(true);
            }}
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
            {data?.meta?.images.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedSubCategory(item)}
                  style={{
                    height: wp(16),
                    width: wp(16),
                    borderRadius: wp(3),
                    backgroundColor: Colors.silver,
                    marginRight: wp(3),
                  }}>
                  <Image
                    source={{uri: item}}
                    resizeMode={'contain'}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                  <Pressable
                    onPress={() => {
                      let temp = {...data.meta};
                      let t1 = [...temp.images];
                      t1.splice(index, 1);
                      temp.images = t1;
                      handleStateChange('meta', temp);
                    }}
                    style={{
                      position: 'absolute',
                      right: -4,
                      top: -4,
                      height: 18,
                      width: 18,
                    }}>
                    <ImageCross width={18} height={18} />
                  </Pressable>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() =>
                ImageSelection()
                  .then((res) => {
                    handleState('images', res);
                  })
                  .catch((err) => {})
              }
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
          value={data?.meta?.customer?.remarks}
          onChange={(text) => handleState('remarks', text)}
        />
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button
          label={'SHOW QUOTATION'}
          isLoading={isLoading}
          onPress={() => {
            let tempError = {};
            setLoading(true);
            if (data?.inventory_items.length === 0) {
              tempError.inventory = false;
              CustomAlert('Please Add atleast one item');
            } else {
              tempError.inventory = true;
            }
            setError(tempError);
            if (
              Object.values(tempError).findIndex((item) => item === false) ===
              -1
            ) {
              setLoading(false);
              setConfirmationModalVisible(true);
            } else {
              setLoading(false);
            }
          }}
        />
      </View>
      <CustomModalAndroid visible={confirmationModalVisible}>
        <OrderDetailModal
          isLoading={isLoading}
          data={data?.inventory_items}
          title={'CONFIRM ITEM LIST'}
          onCloseIcon={() => setConfirmationModalVisible(false)}
          leftOnPress={() => setConfirmationModalVisible(false)}
          rightOnPress={() => {
            // Booking API call
            setLoading(true);
            let obj = {
              url: 'bookings/enquiry',
              method: 'post',
              headers: {
                Authorization:
                  'Bearer ' + STORE.getState().Login?.loginData?.token,
              },
              data: props.data,
            };
            APICall(obj)
              .then((res) => {
                setLoading(false);
                if (res?.data?.status === 'success') {
                  props.setApiResponse(res?.data?.data?.booking);
                  if (props.bookingFor === 'Others') {
                    props.onPageChange(4);
                  } else {
                    props.onPageChange(3);
                  }
                } else {
                  CustomAlert(res?.data?.message);
                }
              })
              .catch((err) => {
                setLoading(false);
                CustomConsole(err);
              });
          }}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={addItem || editItem}
        onPress={() => {
          setAddItem(false);
          setAddData({});
          setEditItem(false);
          setEditData({});
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
              setAddItem(false);
              setAddData({});
              setEditItem(false);
              setEditData({});
            }}
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
          value={editItem ? editData?.name : addData?.name}
          label={'Item Name'}
          width={wp(90)}
          items={defaultInventories}
          onChangeItem={(text, item) => {
            let temp = {...item};

            temp.material = JSON.parse(item.material.toString());
            temp.size = JSON.parse(item.size.toString());

            temp.label = item.name;
            temp.value = item.name;
            let materialAry = [];
            let sizeAry = [];
            temp.material.forEach((i) => {
              materialAry.push({
                label: i,
                value: i,
              });
            });
            temp.size.forEach((i) => {
              sizeAry.push({
                label: i,
                value: i,
              });
            });
            temp.material = materialAry;
            temp.size = sizeAry;
            setSelectedInventory(temp);
            if (editItem) {
              setEditData({...editData, name: text});
            } else {
              setAddData({
                name: text,
                material:
                  defaultInventories.length > 0
                    ? JSON.parse(defaultInventories[0].material.toString())[0]
                    : '',
                size: 'small',
                quantity:
                  configData?.inventory_quantity_type.range ===
                  movementType?.inventory_quantity_type
                    ? {
                        min: 200,
                        max: 750,
                      }
                    : 1,
              });
            }
          }}
        />
        <View
          style={[
            {flexDirection: 'row', marginTop: hp(2)},
            Platform.OS !== 'android' && {zIndex: 5001},
          ]}>
          <DropDownAndroid
            value={editItem ? editData?.material : addData?.material}
            label={'Material'}
            items={selectedInventory?.material}
            onChangeItem={(text) => {
              if (editItem) {
                setEditData({...editData, material: text});
              } else {
                setAddData({...addData, material: text});
              }
            }}
          />
          <DropDownAndroid
            label={'Size'}
            value={editItem ? editData?.size : addData?.size}
            items={selectedInventory?.size}
            onChangeItem={(text) => {
              if (editItem) {
                setEditData({...editData, size: text});
              } else {
                setAddData({...addData, size: text});
              }
            }}
          />
        </View>
        <View style={{width: '90%'}}>
          {(configData?.inventory_quantity_type.range ===
            movementType?.inventory_quantity_type && (
            <View
              style={{
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
                values={
                  editItem
                    ? [editData?.quantity?.min, editData?.quantity?.max]
                    : [addData?.quantity?.min, addData?.quantity?.max]
                }
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
                value={
                  editItem
                    ? editData?.quantity?.toString()
                    : addData?.quantity?.toString()
                }
                onChange={(text) => {
                  if (editItem) {
                    setEditData({...editData, quantity: text});
                  } else {
                    setAddData({...addData, quantity: text});
                  }
                }}
              />
              <Pressable
                style={styles.arrowView}
                onPress={() => {
                  if (editItem) {
                    if (parseInt(editData.quantity) - 1 > 0) {
                      setEditData({
                        ...editData,
                        quantity: editData.quantity - 1,
                      });
                    }
                  } else {
                    if (parseInt(addData.quantity) - 1 > 0) {
                      handleItemState(
                        'quantity',
                        parseInt(addData.quantity) - 1 || 0,
                      );
                    }
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
                  if (editItem) {
                    setEditData({...editData, quantity: editData.quantity + 1});
                  } else {
                    handleItemState(
                      'quantity',
                      parseInt(addData.quantity) + 1 || 0,
                    );
                  }
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
            let temp = [...inventoryItems];
            if (editItem) {
              let index = temp.findIndex(
                (ele) => ele.inventory_id === editData.inventory_id,
              );
              temp[index] = editData;
            } else {
              addData.inventory_id = selectedInventory.id;
              addData.image = selectedInventory.image;
              temp.push(addData);
            }
            handleStateChange('inventory_items', temp);
            setInventoryItems(temp);
            setAddData({});
            setAddItem(false);
            setEditItem(false);
            setEditData({});
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
  sliderText: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
});
