import React from 'react';
import {FlatList, Pressable, Text, View, StyleSheet} from 'react-native';
import {Colors, FAQS_OPTION, wp} from '../../../../constant/colors';
import SimpleHeader from '../../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import RightArrow from '../../../../assets/svg/right_arrow.svg';

const FAQS = (props) => {
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'FAQS'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <View style={{flex: 1, padding: wp(3)}}>
        <FlatList
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          data={FAQS_OPTION}
          bounces={false}
          contentContainerStyle={{justifyContent: 'space-evenly'}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.movementLinear} key={index}>
                <Pressable
                  onPress={() => props.navigation.navigate('FAQDetails')}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: wp(30),
                  }}>
                  {item.image}
                </Pressable>
                <View style={styles.bottomView}>
                  <Text style={styles.bottomText}>{item.name}</Text>
                  <RightArrow width={20} height={20} />
                </View>
              </View>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default FAQS;

const styles = StyleSheet.create({
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.silver,
    backgroundColor: '#FDFDFD',
  },
  bottomView: {
    height: 40,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: Colors.silver,
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.5),
  },
});
