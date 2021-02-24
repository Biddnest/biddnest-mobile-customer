import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import {STYLES} from '../../../constant/commonStyle';
import TwoButton from '../../../components/twoButton';

const OrderDetailModal = (props) => {
  const renderItem = ({item, index}) => {
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
            }}
          />
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
            Cupboards
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={styles.textBox}>
              <Text style={styles.subText} numberOfLines={1}>
                Medium
              </Text>
            </View>
            <Text
              style={[styles.subText, {width: '38%', textAlign: 'center'}]}
              numberOfLines={1}>
              Small
            </Text>
            <View style={[styles.textBox, {width: '20%'}]}>
              <Text style={styles.subText} numberOfLines={1}>
                01
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
        data={[1, 2, 1]}
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
    fontFamily: 'Roboto-Light',
    fontSize: wp(3.5),
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
