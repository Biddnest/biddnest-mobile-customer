import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import {STYLES} from '../../../constant/commonStyle';
import TwoButton from '../../../components/twoButton';
import {useSelector} from 'react-redux';

const OrderDetailModal = (props) => {
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.service) || {};
  const renderItem = ({item, index}) => {
    let quantity = '';
    if (props.from === 'RequirementDetails') {
      if (item?.quantity.min) {
        quantity = item?.quantity.min + '-' + item?.quantity.max;
      } else {
        quantity = item?.quantity;
      }
    } else {
      if (configData?.inventory_quantity_type?.range === item?.quantity_type) {
        quantity =
          JSON.parse(item?.quantity?.toString()).min +
          '-' +
          JSON.parse(item?.quantity?.toString()).max;
      } else {
        quantity = item?.quantity;
      }
    }
    return (
      <View
        style={{flexDirection: 'row', height: wp(13), marginVertical: hp(2)}}
        key={index}>
        <View style={{width: '20%', ...STYLES.common}}>
          <View
            style={{
              height: wp(13),
              width: wp(13),
              backgroundColor: '#F2E6FF',
              borderRadius: wp(13) / 2,
            }}>
            <Image
              source={{uri: item?.image}}
              resizeMode={'contain'}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: '78%',
            marginLeft: '2%',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: wp(4),
              color: Colors.inputTextColor,
            }}>
            {item?.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={[styles.textBox, {paddingHorizontal: 10, width: '40%'}]}>
              <Text style={styles.subText} numberOfLines={1}>
                {item?.material}
              </Text>
            </View>
            <Text
              style={[
                styles.subText,
                {
                  width: '25%',
                  textAlign: 'center',
                  textTransform: 'capitalize',
                },
              ]}
              numberOfLines={1}>
              {item?.size}
            </Text>
            <View style={[styles.textBox, {maxWidth: '30%'}]}>
              <Text
                style={[
                  styles.subText,
                  {paddingHorizontal: 10, textTransform: 'none'},
                ]}
                numberOfLines={1}>
                x{quantity}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Roboto-Regular',
            color: Colors.inputTextColor,
          }}>
          {props.title}
        </Text>
        <CloseIcon onPress={props.onCloseIcon} />
      </View>
      <View style={{...styles.separatorView, width: '90%'}} />
      <FlatList
        bounces={false}
        data={props.data}
        extraData={props.data}
        renderItem={renderItem}
        contentContainerStyle={{
          marginHorizontal: wp(4),
          marginBottom: hp(5),
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderWidth: 0.7,
              borderColor: Colors.silver,
            }}
          />
        )}
      />
      {props.title === 'CONFIRM ITEM LIST' ? (
        <TwoButton
          isLoading={props.isLoading}
          leftLabel={'cancel'}
          rightLabel={'confirm'}
          leftOnPress={props.leftOnPress}
          rightOnPress={props.rightOnPress}
        />
      ) : null}
    </View>
  );
};

export default OrderDetailModal;

const styles = StyleSheet.create({
  subText: {
    fontSize: wp(3.5),
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  textBox: {
    width: '30%',
    backgroundColor: Colors.silver,
    paddingVertical: 5,
    borderRadius: 5,
    ...STYLES.common,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginVertical: hp(1),
  },
});
