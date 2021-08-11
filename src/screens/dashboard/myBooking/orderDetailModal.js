import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
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
        style={{
          flexDirection: 'row',
          marginVertical: hp(0.5),
          width: '100%',
        }}
        key={index}>
        <View
          style={{
            height: wp(13),
            width: wp(13),
            backgroundColor: '#F2E6FF',
            borderRadius: wp(13) / 2,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: item?.image || item?.inventory?.image}}
            resizeMode={'contain'}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>
        <View
          style={{
            width: '85%',
            marginLeft: '0.5%',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: wp(3.5),
              color: Colors.inputTextColor,
            }}>
            {item?.itemName || item?.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: hp(0.2),
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
                x
                {typeof quantity === 'string' ? quantity : quantity?.toString()}
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
      <ScrollView
        style={{
          flex: 1,
          maxHeight: hp(75),
          marginBottom: props.title === 'CONFIRM ITEM LIST' ? hp(6) : 0,
        }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          scrollEnabled={false}
          data={props.data}
          extraData={props.data}
          renderItem={renderItem}
          contentContainerStyle={{
            marginHorizontal: wp(4),
            flex: 1,
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
      </ScrollView>
      {props.title === 'CONFIRM ITEM LIST' ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
          }}>
          <TwoButton
            isLoading={props.isLoading}
            leftLabel={'cancel'}
            rightLabel={'confirm'}
            leftOnPress={props.leftOnPress}
            rightOnPress={props.rightOnPress}
          />
        </View>
      ) : null}
    </View>
  );
};

export default OrderDetailModal;

const styles = StyleSheet.create({
  subText: {
    fontSize: wp(3.2),
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
