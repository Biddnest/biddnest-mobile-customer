import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {HomeHeader} from '../home';
import {STYLES} from '../../../constant/commonStyle';

const MyBooking = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleOrderClicked = (item) => {
    props.navigation.navigate('OrderTracking', {orderData: item});
  };
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={styles.inputForm}
        key={index}
        onPress={() => selectedTab === 0 && handleOrderClicked(item)}>
        <View
          style={{
            backgroundColor: Colors.white,
            flexDirection: 'row',
          }}>
          <View />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}>
            <View>
              <Text style={{...styles.locationText, marginTop: 0}}>
                CHENNAI
              </Text>
              <Text style={styles.locationText}>BENGALURU</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{...styles.locationText, marginTop: 0}}>
                DISTANCE
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(1),
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(4.5),
                    color: Colors.inputTextColor,
                  }}>
                  314KM
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.separatorView} />
        {selectedTab === 1 && (
          <View style={styles.flexBox}>
            <Text style={styles.leftText}>price</Text>
            <Text style={styles.rightText}>Rs. 5000</Text>
          </View>
        )}
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>moving date</Text>
          <Text style={styles.rightText}>25 Jan 2021</Text>
        </View>
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>category</Text>
          <Text style={styles.rightText}>1 BHK</Text>
        </View>
        <View style={styles.flexBox}>
          <Text style={styles.leftText}>status</Text>
          <Text style={styles.rightText}>Completed</Text>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <HomeHeader navigation={props.navigation} title={'MY BOOKINGS'} />
      <View style={{height: hp(7), flexDirection: 'row'}}>
        {['Ongoing Orders', 'Past Orders'].map((item, index) => {
          return (
            <Pressable
              key={index}
              style={{
                ...styles.tabViews,
                ...STYLES.common,
                borderColor:
                  selectedTab === index ? Colors.darkBlue : '#ACABCD',
                borderBottomWidth: selectedTab === index ? 2 : 0.8,
              }}
              onPress={() => setSelectedTab(index)}>
              <Text
                style={{
                  ...styles.tabText,
                  color: selectedTab === index ? Colors.darkBlue : '#ACABCD',
                }}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text
              style={{
                fontFamily: 'Roboto-Italic',
                fontSize: wp(3.5),
                color: '#99A0A5',
                textAlign: 'center',
                marginHorizontal: 20,
                marginVertical: hp(5),
              }}>
              No any orders!
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default MyBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  tabViews: {
    flex: 1,
  },
  tabText: {
    fontSize: wp(4),
    fontFamily: 'Roboto-Medium',
  },
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(2),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(2),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
    textTransform: 'uppercase',
  },
  rightText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
    color: Colors.inputTextColor,
  },
});
