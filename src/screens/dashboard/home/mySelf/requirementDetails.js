import React, {useState, useEffect} from 'react';
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
import FlatButton from '../../../../components/flatButton';
import {
  CustomAlert,
  CustomConsole,
  ImageSelection,
} from '../../../../constant/commonFun';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import OrderDetailModal from '../../myBooking/orderDetailModal';
import ImageCross from '../../../../assets/svg/image_cross.svg';
import CustomLabel from './CustomLabel';
import {APICall} from '../../../../redux/actions/user';
import {STORE} from '../../../../redux';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import TwoButton from '../../../../components/twoButton';
import SearchableItem from '../../../../components/searchableItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ripple from 'react-native-material-ripple';
import AntDesign from 'react-native-vector-icons/AntDesign';

const RequirementDetails = (props) => {
  const {
    data,
    handleStateChange,
    movementType,
    selectedSubCategory,
    handleSelectedSubCategory,
  } = props;
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.service) || {};
  const [defaultInventories, setDefaultInventories] = useState(
    useSelector((state) => state.Login?.inventoriesData?.inventories) || [],
  );
  const [isLoading, setLoading] = useState(false);
  const [isWait, setWait] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState({});
  const [addItem, setAddItem] = useState(false);
  const [addData, setAddData] = useState({});
  const [editItem, setEditItem] = useState(false);
  const [imageSelect, setImageSelect] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [editableWarning, setEditableWarning] = useState(false);
  const [changeCategoryVisible, setChangeCategoryVisible] = useState({});
  const [editData, setEditData] = useState({});
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false,
  );
  const [defaultInventoryStore, setDefaultInventoryStore] = useState(
    data?.inventory_items,
  );
  const [error, setError] = useState({
    inventory: undefined,
  });
  const [subServices, setSubServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState(data?.inventory_items);
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
    // if (inv.findIndex((item) => item.id === 'select') === -1 && isAndroid) {
    //   inv.unshift({
    //     label: '-Select-',
    //     value: null,
    //     category: '',
    //     id: 'select',
    //     image:
    //       'http://localhost:8000/storage/inventories/inventory-imageTable-603cd3ca1cb58.png',
    //     material: '["wood","plastic","steel","fibre","glass"]',
    //     name: '-Select-',
    //     size: '["small","medium","large"]',
    //   });
    //   inv.push({
    //     label: '-Other-',
    //     value: 'other',
    //     category: '',
    //     id: null,
    //     image:
    //       'http://localhost:8000/storage/inventories/inventory-imageTable-603cd3ca1cb58.png',
    //     material: '["wood","plastic","steel","fibre","glass"]',
    //     name: '-Other-',
    //     size: '["small","medium","large"]',
    //   });
    // }
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
        if (materialAry.findIndex((item) => item.value === null) === -1) {
          materialAry.unshift({
            label: '-Select-',
            value: null,
          });
        }
        temp.size.forEach((item) => {
          sizeAry.push({
            label: item,
            value: item,
          });
        });
        if (sizeAry.findIndex((item) => item.value === null) === -1) {
          sizeAry.unshift({
            label: '-Select-',
            value: null,
          });
        }
        temp.material = materialAry;
        temp.size = sizeAry;
        setSelectedInventory(temp);
      } else {
        setSelectedInventory({});
      }
    }
  }, [defaultInventories]);
  const getInventories = (id) => {
    setWait(true);
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
                        min: parseInt(item?.quantity?.min),
                        max: parseInt(item?.quantity?.max),
                      }
                    : parseInt(item?.quantity),
                name: item?.meta?.name,
                image: item?.meta?.image,
              });
            });
            setDefaultInventoryStore(temp);
            setInventoryItems(temp);
            handleStateChange('inventory_items', temp);
          } else {
            setDefaultInventoryStore([]);
            setInventoryItems([]);
            handleStateChange('inventory_items', []);
          }
        } else {
          CustomAlert(res?.data?.message);
        }
        setWait(false);
      })
      .catch((err) => {
        setWait(false);
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
            if (!selectedSubCategory) {
              handleSelectedSubCategory(temp);
              getInventories(temp.id);
              handleState('subcategory', temp.name);
            } else {
              handleSelectedSubCategory(selectedSubCategory);
              handleState('subcategory', selectedSubCategory.name);
            }
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
            fontFamily: 'Gilroy-Bold',
            color: Colors.inputTextColor,
            fontSize: wp(4.5),
          }}>
          {item?.itemName || item.name}
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
              {item?.material}, {item?.size}
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
                    t1.quantity =
                      typeof t1?.quantity === 'string'
                        ? parseInt(t1?.quantity) - 1 || 0
                        : t1?.quantity - 1 || 0;
                    setInventoryItems(temp);
                    handleStateChange('inventory_items', temp);
                  }
                }}>
                <MaterialCommunityIcons
                  name={'minus'}
                  size={hp(2.5)}
                  color={Colors.inputTextColor}
                />
              </Pressable>
              <Text
                style={{
                  color: Colors.inputTextColor,
                  fontSize: wp(3.5),
                }}>
                {item?.quantity || 0}
              </Text>
              <Pressable
                onPress={() => {
                  let temp = [...inventoryItems];
                  let t1 = temp[index];
                  t1.quantity =
                    typeof t1?.quantity === 'string'
                      ? parseInt(t1?.quantity) + 1 || 0
                      : t1?.quantity + 1 || 0;
                  setInventoryItems(temp);
                  handleStateChange('inventory_items', temp);
                }}>
                <MaterialCommunityIcons
                  name={'plus'}
                  size={hp(2.5)}
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
                size={hp(2.5)}
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
              <Ionicons
                name={'trash-outline'}
                size={hp(2.5)}
                color={Colors.darkBlue}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };
  const setImage = (type) => {
    ImageSelection(type)
      .then((res) => {
        handleState('images', res);
      })
      .catch((err) => {});
  };
  let imageData = [...data?.meta?.images];
  imageData.push('Plus');
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: hp(2),
          fontFamily: 'Gilroy-SemiBold',
          fontSize: wp(4),
          textTransform: 'uppercase',
        }}>
        Pick an item list
      </Text>
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
                setChangeCategoryVisible(item);
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
                  fontFamily: 'Gilroy-Bold',
                  color:
                    selectedSubCategory.id === item.id
                      ? Colors.darkBlue
                      : Colors.inputTextColor,
                  fontSize: wp(3.5),
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
        <Text style={STYLES.textHeader}>
          {selectedSubCategory?.name
            ? `${selectedSubCategory?.name} ITEM LIST`
            : `${movementType?.name} ITEM LIST`}
        </Text>
        <View style={{marginTop: hp(3)}}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
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
            onRefresh={() => {}}
            refreshing={isWait}
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
            label={'I NEED MORE SPACE'}
            backgroundColor={Colors.white}
            spaceBottom={0}
            onPress={() => {
              setAddData({
                name: null,
                material: null,
                size: null,
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
                    style={{
                      height: wp(16),
                      width: wp(16),
                      borderRadius: wp(3),
                      backgroundColor: Colors.btnBG,
                      marginRight: wp(3),
                      marginTop: hp(1),
                      ...STYLES.common,
                    }}>
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
                  onPress={() => handleSelectedSubCategory(item)}
                  style={{
                    height: wp(16),
                    width: wp(16),
                    borderRadius: wp(3),
                    backgroundColor: Colors.silver,
                    marginRight: wp(3),
                    marginTop: hp(1),
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
            }}
          />
        </View>
      </View>
      <View style={[styles.inputForm, {paddingTop: hp(2), paddingBottom: 0}]}>
        <Text style={STYLES.textHeader}>COMMENTS IF ANY</Text>
        <View style={{marginTop: hp(2), marginBottom: 0}}>
          <TextInput
            label={''}
            placeHolder={'Comments if any'}
            numberOfLines={4}
            value={data?.meta?.customer?.remarks}
            onChange={(text) => handleState('remarks', text)}
          />
        </View>
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
      <CustomModalAndroid
        visible={confirmationModalVisible}
        title={'CONFIRM ITEM LIST'}
        maxHeight={hp(90)}
        showsVerticalScrollIndicator={true}
        onPress={() => setConfirmationModalVisible(false)}>
        <OrderDetailModal
          from={'RequirementDetails'}
          isLoading={isLoading}
          data={data?.inventory_items}
          title={'CONFIRM ITEM LIST'}
          onCloseIcon={() => setConfirmationModalVisible(false)}
          leftOnPress={() => setConfirmationModalVisible(false)}
          rightOnPress={() => {
            setEditableWarning(true);
            setConfirmationModalVisible(false);
          }}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={addItem || editItem}
        title={editItem ? 'EDIT ITEM' : 'ADD ITEM'}
        onPress={() => {
          setAddItem(false);
          setAddData({});
          setEditItem(false);
          setEditData({});
        }}>
        <Pressable
          onPress={() => {
            if (addItem) {
              setOpenPicker(true);
            }
          }}
          style={{
            width: wp(90),
            paddingHorizontal: 10,
          }}>
          <Text style={styles.textLabel}>{'Item Name'}</Text>
          <View style={styles.outerView}>
            <Text numberOfLines={1} style={styles.innerText}>
              {addItem
                ? addData?.name || '-Select-'
                : editData?.name || '-Select-'}
            </Text>
            <MaterialIcons
              name={!openPicker ? 'arrow-drop-down' : 'arrow-drop-up'}
              size={hp(3.5)}
              color={'#3B4B58'}
            />
          </View>
        </Pressable>
        {(addData?.name === '-Other-' || editData?.name === '-Other-') && (
          <View style={{width: '90%', marginTop: hp(2)}}>
            <TextInput
              value={editItem ? editData?.itemName : addData?.itemName}
              label={'Item Name'}
              placeHolder={'Add Custom item'}
              onChange={(text) => {
                if (editItem) {
                  setEditData({
                    ...editData,
                    itemName: text,
                  });
                } else {
                  setAddData({
                    ...addData,
                    itemName: text,
                  });
                }
              }}
            />
          </View>
        )}
        <View
          style={[
            {
              flexDirection: 'row',
              marginTop:
                addData?.name === '-Other-' || editData?.name === '-Other-'
                  ? -hp(1)
                  : hp(2),
            },
            Platform.OS !== 'android' && {zIndex: 5001},
          ]}>
          {((addData?.name === '-Other-' || editData?.name === '-Other-') && (
            <View style={{width: '45%', marginTop: hp(1)}}>
              <TextInput
                value={editItem ? editData?.material : addData?.material}
                label={'Material/Variant'}
                placeHolder={'Material/Variant'}
                onChange={(text) => {
                  if (editItem) {
                    setEditData({...editData, material: text});
                  } else {
                    setAddData({...addData, material: text});
                  }
                }}
              />
            </View>
          )) || (
            <View
              style={{
                width: wp(45),
                paddingHorizontal: 10,
                marginBottom: hp(2),
              }}>
              <Text style={styles.textLabel}>{'Material/Variant'}</Text>
              <View
                style={[
                  styles.outerView,
                  {width: '100%', paddingHorizontal: 0},
                ]}>
                <Picker
                  style={{
                    height: '99%',
                    width: '100%',
                  }}
                  selectedValue={
                    editItem ? editData?.material : addData?.material
                  }
                  onValueChange={(text) => {
                    if (editItem) {
                      setEditData({...editData, material: text});
                    } else {
                      setAddData({...addData, material: text});
                    }
                  }}>
                  {selectedInventory?.material?.map((item, index) => {
                    return (
                      <Picker.Item label={item?.label} value={item?.value} />
                    );
                  })}
                </Picker>
              </View>
            </View>
          )}
          {((addData?.name === '-Other-' || editData?.name === '-Other-') && (
            <View style={{width: '45%', marginTop: hp(1)}}>
              <TextInput
                label={'Size'}
                value={editItem ? editData?.size : addData?.size}
                placeHolder={'Size'}
                onChange={(text) => {
                  if (editItem) {
                    setEditData({...editData, size: text});
                  } else {
                    setAddData({...addData, size: text});
                  }
                }}
              />
            </View>
          )) || (
            <View
              style={{
                width: wp(45),
                paddingHorizontal: 10,
                marginBottom: hp(2),
              }}>
              <Text style={styles.textLabel}>{'Size'}</Text>
              <View
                style={[
                  styles.outerView,
                  {width: '100%', paddingHorizontal: 0},
                ]}>
                <Picker
                  style={{
                    height: '99%',
                    width: '100%',
                  }}
                  // selectedValue={editItem ? editData?.size : addData?.size}
                  selectedValue={editItem ? editData?.size : addData?.size}
                  onValueChange={(text) => {
                    if (editItem) {
                      setEditData({...editData, size: text});
                    } else {
                      setAddData({...addData, size: text});
                    }
                  }}>
                  {selectedInventory?.size?.map((item, index) => {
                    return (
                      <Picker.Item label={item?.label} value={item?.value} />
                    );
                  })}
                </Picker>
              </View>
            </View>
          )}
        </View>
        <View style={{width: '90%'}}>
          {(configData?.inventory_quantity_type.range ===
            movementType?.inventory_quantity_type && (
            <View
              style={{
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
                      height: hp(2),
                      width: hp(2),
                      borderRadius: hp(1),
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
                marginTop:
                  addData?.name === '-Other-' || editData?.name === '-Other-'
                    ? hp(0.01)
                    : hp(2),
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
                keyboard={'decimal-pad'}
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
                  size={hp(5)}
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
                  size={hp(5)}
                  color={Colors.btnBG}
                />
              </Pressable>
            </View>
          )}
        </View>
        <FlatButton
          onPress={() => {
            let temp = [...inventoryItems];
            let error = [];
            if (editItem) {
              if (
                (configData?.inventory_quantity_type.range !==
                  movementType?.inventory_quantity_type &&
                  parseInt(editData?.quantity) !== 0) ||
                configData?.inventory_quantity_type.range ===
                  movementType?.inventory_quantity_type
              ) {
                if (
                  editData?.inventory_id !== null
                    ? editData.name !== null &&
                      editData.material !== null &&
                      editData.size !== null
                    : editData.name !== null &&
                      editData.material !== null &&
                      editData.size !== null &&
                      editData?.itemName !== null &&
                      editData?.itemName !== ''
                ) {
                  let obj = temp.find((i) => {
                    if (
                      i.name === editData.name &&
                      i.material === editData.material &&
                      i.size === editData.size &&
                      i.itemName === editData.itemName
                    ) {
                      return i;
                    }
                  });
                  if (!obj) {
                    let index = temp.findIndex(
                      (ele) => ele.inventory_id === editData.inventory_id,
                    );
                    console.log(index);
                    if (
                      configData?.inventory_quantity_type.range !==
                      movementType?.inventory_quantity_type
                    ) {
                      editData.quantity = parseInt(editData?.quantity);
                    }
                    temp[index] = editData;
                    handleStateChange('inventory_items', temp);
                    setInventoryItems(temp);
                    setEditItem(false);
                    setEditData({});
                  } else {
                    CustomAlert('The item has already been added.');
                  }
                } else {
                  CustomAlert('All Fields are mendatory');
                }
              } else {
                CustomAlert('Quantity not valid');
              }
            } else {
              if (
                addData?.inventory_id !== null
                  ? addData.name !== null &&
                    addData.material !== null &&
                    addData.size !== null
                  : addData.name !== null &&
                    addData.material !== null &&
                    addData.size !== null &&
                    addData?.itemName !== null &&
                    addData?.itemName !== ''
              ) {
                if (
                  (configData?.inventory_quantity_type.range !==
                    movementType?.inventory_quantity_type &&
                    parseInt(addData?.quantity) !== 0) ||
                  configData?.inventory_quantity_type.range ===
                    movementType?.inventory_quantity_type
                ) {
                  let obj = temp.find((i) => {
                    if (
                      i.name === addData.name &&
                      i.material === addData.material &&
                      i.size === addData.size
                    ) {
                      return i;
                    }
                  });
                  if (!obj) {
                    addData.inventory_id = selectedInventory.id;
                    addData.image = selectedInventory.image;
                    if (
                      configData?.inventory_quantity_type.range !==
                      movementType?.inventory_quantity_type
                    ) {
                      addData.quantity = parseInt(addData?.quantity);
                    }
                    temp.push(addData);
                    handleStateChange('inventory_items', temp);
                    setInventoryItems(temp);
                    setAddData({});
                    setAddItem(false);
                  } else {
                    CustomAlert('The item has already been added.');
                  }
                } else {
                  CustomAlert('Quantity not valid');
                }
              } else {
                CustomAlert('All Fields are mendatory');
              }
            }
          }}
          label={editItem ? 'SAVE' : 'ADD ITEM'}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={!!changeCategoryVisible?.id}
        title={'Warning'}
        onPress={() => {
          setChangeCategoryVisible({});
        }}>
        <View
          style={{
            marginTop: hp(4),
            marginBottom: hp(2),
            marginHorizontal: wp(15),
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: wp(4),
              color: Colors.inputTextColor,
              marginBottom: hp(2),
              textAlign: 'center',
            }}>
            Are you sure? you want to change category?
          </Text>
        </View>
        <TwoButton
          leftLabel={'no'}
          rightLabel={'Yes'}
          isLoading={isLoading}
          leftOnPress={() => {
            // handleState('subcategory', changeCategoryVisible.name);
            // getInventories(changeCategoryVisible.id);
            // handleSelectedSubCategory(changeCategoryVisible);
            setChangeCategoryVisible({});
          }}
          rightOnPress={() => {
            setChangeCategoryVisible({});
            handleState('subcategory', changeCategoryVisible?.name);
            handleSelectedSubCategory(changeCategoryVisible);
            setWait(true);
            let obj = {
              url: `inventories?subservice_id=${changeCategoryVisible?.id}`,
              method: 'get',
              headers: {
                Authorization:
                  'Bearer ' + STORE.getState().Login?.loginData?.token,
              },
            };
            APICall(obj)
              .then((res) => {
                if (res?.data?.status === 'success') {
                  let temp = [];
                  let previousDummyInv = [...defaultInventoryStore];
                  let t = [...inventoryItems];
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
                                min: parseInt(item?.quantity?.min),
                                max: parseInt(item?.quantity?.max),
                              }
                            : parseInt(item?.quantity),
                        name: item?.meta?.name,
                        image: item?.meta?.image,
                      });
                    });
                    let temp2 = [...t, ...temp];
                    var result = temp2.reduce((unique, o) => {
                      if (
                        !unique.some(
                          (obj) =>
                            obj.name === o.name &&
                            obj.material === o.material &&
                            obj.size === o.size &&
                            obj.itemName === o.itemName,
                        )
                      ) {
                        unique.push(o);
                      }
                      return unique;
                    }, []);
                    setDefaultInventoryStore(temp);
                    setInventoryItems(result);
                    handleStateChange('inventory_items', result);
                  } else {
                    setInventoryItems(t);
                    setDefaultInventoryStore([]);
                    handleStateChange('inventory_items', []);
                  }
                } else {
                  CustomAlert(res?.data?.message);
                }
                setWait(false);
              })
              .catch((err) => {
                setWait(false);
                CustomConsole(err);
              });
          }}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={editableWarning}
        title={'Warning'}
        onPress={() => {
          setEditableWarning(false);
        }}>
        <View
          style={{
            marginTop: hp(4),
            marginBottom: hp(2),
            marginHorizontal: wp(15),
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: wp(4),
              color: Colors.inputTextColor,
              marginBottom: hp(2),
              textAlign: 'center',
            }}>
            Order details will not be editable after confirmation.
          </Text>
        </View>
        <TwoButton
          leftLabel={'cancel'}
          rightLabel={'okay'}
          isLoading={isLoading}
          leftOnPress={() => {
            setEditableWarning(false);
          }}
          rightOnPress={() => {
            // Booking API call
            setLoading(true);
            let temp = {...props.data};
            let t2 = [...temp?.inventory_items];
            t2.forEach((item, index) => {
              if (item?.inventory_id === null) {
                item.name = item.itemName;
                // delete t2[index].itemName;
              }
            });
            temp.inventory_items = t2;
            let obj = {
              url: 'bookings/enquiry',
              method: 'post',
              headers: {
                Authorization:
                  'Bearer ' + STORE.getState().Login?.loginData?.token,
              },
              data: temp,
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
      <SearchableItem
        visible={!!openPicker}
        title={'Warning'}
        onPress={() => {
          setOpenPicker(false);
        }}
        onConfirmPress={(itemData) => {
          setOpenPicker(false);
          if (itemData) {
            let temp = {...itemData};
            temp.material = JSON.parse(itemData.material.toString());
            temp.size = JSON.parse(itemData.size.toString());

            temp.label = itemData.name;
            temp.value = itemData.name;
            let materialAry = [];
            let sizeAry = [];
            temp.material.forEach((i) => {
              materialAry.push({
                label: i,
                value: i,
              });
            });
            if (materialAry.findIndex((item) => item.value === null) === -1) {
              materialAry.unshift({
                label: '-Select-',
                value: null,
              });
            }
            temp.size.forEach((i) => {
              sizeAry.push({
                label: i,
                value: i,
              });
            });
            if (sizeAry.findIndex((item) => item.value === null) === -1) {
              sizeAry.unshift({
                label: '-Select-',
                value: null,
              });
            }
            temp.material = materialAry;
            temp.size = sizeAry;
            setSelectedInventory(temp);
            if (editItem) {
              setEditData({
                ...editData,
                inventory_id: itemData?.id,
                name: itemData?.name,
                itemName: itemData?.itemName,
                material: null,
                size: null,
                quantity:
                  configData?.inventory_quantity_type.range ===
                  movementType?.inventory_quantity_type
                    ? {
                        min: 200,
                        max: 750,
                      }
                    : 1,
              });
            } else {
              setAddData({
                name: itemData?.name,
                inventory_id: itemData?.id,
                itemName: itemData?.itemName,
                material: null,
                size: null,
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
          }
        }}
        defaultInventories={defaultInventories}
      />
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
    height: hp(6),
    width: hp(6),
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
    height: hp(5),
    width: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: '#EFEFF3',
  },
  sliderText: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  textLabel: {
    fontFamily: 'Roboto-Bold',
    color: Colors.textLabelColor,
    fontSize: wp(4),
    marginBottom: hp(1),
  },
  outerView: {
    borderWidth: 2,
    borderRadius: 10,
    height: hp(6),
    borderColor: Colors.silver,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingHorizontal: wp(5),
    flexDirection: 'row',
  },
  innerText: {
    width: '90%',
    fontFamily: 'Gilroy-SemiBold',
    fontSize: wp(4),
    backgroundColor: Colors.textBG,
    color: Colors.inputTextColor,
  },
});
