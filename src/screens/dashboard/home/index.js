import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import Shimmer from '../../../components/shimmer';
import LinearGradient from 'react-native-linear-gradient';

const HomeHeader = (props) => {
  return (
    <View
      style={[
        boxShadow,
        {
          height: 55,
          backgroundColor: Colors.white,
          flexDirection: 'row',
        },
      ]}>
      <Pressable
        style={{width: wp(13), height: '100%', ...styles.common}}
        onPress={() => props.navigation.toggleDrawer()}>
        <Image
          source={require('../../../assets/images/menu_icon.png')}
          resizeMode={'contain'}
          style={{
            height: 20,
            width: 20,
          }}
        />
      </Pressable>
      <View style={{width: wp(87), height: '100%', ...styles.common}}>
        <Image
          source={require('../../../assets/images/biddnest_logo.png')}
          resizeMode={'contain'}
          style={{
            height: '65%',
            width: '70%',
            marginRight: wp(13),
          }}
        />
      </View>
    </View>
  );
};

const Home = (props) => {
  const renderItem = ({item, index}) => {
    return (
      <Shimmer
        autoRun={true}
        style={{
          height: hp(15),
          width: wp(70),
          marginRight: wp(4),
        }}
        visible={true}>
        <View
          style={[
            styles.topScroll,
            {
              ...styles.common,
            },
          ]}
          key={index}>
          <Image
            style={{
              height: '100%',
              width: '100%',
            }}
            source={require('../../../assets/images/top_home_scroll.png')}
            resizeMode={'cover'}
            key={index}
          />
        </View>
      </Shimmer>
    );
  };
  return (
    <View style={styles.container}>
      <HomeHeader navigation={props.navigation} />
      <ScrollView
        style={[styles.container, {marginBottom: hp(7)}]}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: wp(4),
            paddingRight: 0,
            height: hp(20),
          }}
          style={{height: hp(20)}}
        />
        <View style={styles.movementView}>
          <Text
            style={{
              fontFamily: 'Gilroy-Light',
              fontSize: wp(4),
              color: Colors.inputTextColor,
              textAlign: 'center',
            }}>
            MOVEMENT TYPE
          </Text>
          <FlatList
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            data={[
              {
                name: 'Residential',
              },
              {
                name: 'Commercial',
              },
              {
                name: 'Office',
              },
            ]}
            style={{marginTop: hp(2)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <LinearGradient
                  colors={['#49039B', '#0F0C75']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.movementLinear}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.white,
                        fontSize: wp(3.8),
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </LinearGradient>
              );
            }}
          />
        </View>
        <View style={styles.assistantView}>
          <View>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: wp(5),
                color: '#0F0C75',
              }}>
              NEED ASSISTANCE?
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: '#434343',
                fontSize: wp(3.6),
                marginTop: hp(2),
              }}>
              We are just a call away! {'\n'}(9123445566)
            </Text>
          </View>
          <Image
            source={require('../../../assets/images/home_call.png')}
            resizeMode={'contain'}
            style={{height: 55, width: 55}}
          />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          renderItem={({item, index}) => {
            return (
              <Shimmer
                autoRun={true}
                style={{
                  height: hp(25),
                  width: wp(60),
                  marginRight: wp(4),
                }}
                visible={true}>
                <View
                  style={[
                    styles.topScroll,
                    {
                      width: wp(60),
                      height: hp(25),
                      ...styles.common,
                    },
                  ]}
                  key={index}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                    source={require('../../../assets/images/top_home_scroll.png')}
                    resizeMode={'cover'}
                    key={index}
                  />
                </View>
              </Shimmer>
            );
          }}
          contentContainerStyle={{
            padding: wp(4),
            paddingRight: 0,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#EFEFF4',
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topScroll: {
    height: hp(15),
    width: wp(70),
    borderRadius: 10,
    backgroundColor: Colors.black,
    marginRight: wp(4),
    overflow: 'hidden',
  },
  movementView: {
    padding: wp(3),
    borderRadius: 10,
    borderColor: Colors.silver,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    width: wp(92),
    alignSelf: 'center',
  },
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
  },
  assistantView: {
    flexDirection: 'row',
    padding: wp(5),
    marginTop: hp(3),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.silver,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    width: wp(92),
    alignSelf: 'center',
  },
});
