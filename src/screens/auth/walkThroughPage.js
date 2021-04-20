import React, {Component, useState} from 'react';
import {View, Alert, StyleSheet, Text, Pressable, Image} from 'react-native';
import {resetNavigator} from '../../constant/commonFun';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {Colors, hp, wp} from '../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = [
  {
    title: 'select destination',
    desc:
      "Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.",
  },
  {
    title: 'Share Requirement',
    desc:
      "Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.",
  },
  {
    title: 'Schedule & Confirm',
    desc:
      "Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.",
  },
  {
    title: 'Get Moving!',
    desc:
      "Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.",
  },
];

const WalkThroughPage = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <View style={{flex: 1}}>
      <SwiperFlatList
        index={selectedIndex}
        showPagination
        data={data}
        extraData={selectedIndex}
        paginationStyle={{
          bottom: hp(10),
        }}
        paginationDefaultColor={'#FFE672'}
        onChangeIndex={({index}) => {
          setSelectedIndex(index);
        }}
        renderItem={({item}) => (
          <View style={[styles.child]}>
            <Image
              source={require('../../assets/images/coupon.png')}
              style={{
                height: wp(70),
                width: wp(70),
                alignSelf: 'center',
                marginBottom: hp(8),
              }}
              resizeMode={'contain'}
            />
            <Text style={styles.textTitle}>{item?.title}</Text>
            <Text style={styles.textDesc}>{item?.desc}</Text>
          </View>
        )}
      />
      {selectedIndex !== 3 && (
        <Text
          onPress={() => resetNavigator(props, 'Dashboard')}
          style={{
            position: 'absolute',
            bottom: hp(5),
            left: wp(10),
            ...styles.textTitle,
          }}>
          Skip
        </Text>
      )}
      <Pressable
        onPress={() => {
          if (selectedIndex === 3) {
            resetNavigator(props, 'Dashboard');
          } else {
            setSelectedIndex(selectedIndex + 1);
          }
        }}
        style={{
          position: 'absolute',
          bottom: hp(5),
          right: wp(10),
        }}>
        {(selectedIndex === 3 && (
          <Text style={styles.textTitle}>Done</Text>
        )) || (
          <MaterialIcons
            name={'arrow-forward-ios'}
            size={30}
            color={Colors.white}
          />
        )}
      </Pressable>
    </View>
  );
};

export default WalkThroughPage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  child: {
    width: wp(100),
    justifyContent: 'center',
    backgroundColor: Colors.btnBG,
  },
  textTitle: {
    fontSize: wp(6),
    textAlign: 'center',
    fontFamily: 'Gilroy-Bold',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  textDesc: {
    fontSize: wp(4.5),
    textAlign: 'center',
    fontFamily: 'Gilroy-Regular',
    color: Colors.white,
    textTransform: 'capitalize',
    marginTop: hp(2),
    marginHorizontal: wp(5.5),
  },
});
