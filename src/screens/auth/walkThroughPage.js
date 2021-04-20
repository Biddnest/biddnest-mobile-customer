import React, {Component, useState} from 'react';
import {View, Alert, StyleSheet, Text, Pressable} from 'react-native';
import {resetNavigator} from '../../constant/commonFun';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {Colors, hp, wp} from '../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = [
  {title: 'tomato', desc: 'asdasd'},
  {title: 'tomato', desc: ''},
  {title: 'tomato', desc: ''},
  {title: 'tomato', desc: ''},
];

const WalkThroughPage = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log(selectedIndex);
  return (
    <View style={{flex: 1}}>
      <SwiperFlatList
        index={selectedIndex}
        showPagination
        data={data}
        extraData={selectedIndex}
        paginationStyle={{
          bottom: hp(15),
        }}
        paginationDefaultColor={'#FFE672'}
        onChangeIndex={({index}) => {
          setSelectedIndex(index);
        }}
        renderItem={({item}) => (
          <View style={[styles.child]}>
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
    fontSize: wp(5),
    textAlign: 'center',
    fontFamily: 'Gilroy-SemiBold',
    color: Colors.white,
    textTransform: 'capitalize',
    marginTop: hp(2),
  },
});
