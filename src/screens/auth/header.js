import React from 'react';
import {View, ImageBackground, Image, StyleSheet} from 'react-native';
import {Colors, hp, wp} from '../../constant/colors';

const Header = () => {
  return (
    <View style={styles.topView}>
      <ImageBackground
        source={require('../../assets/images/logo_background.png')}
        style={{height: '100%', width: '100%', ...styles.common}}
        resizeMode={'cover'}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{height: '60%', width: '60%'}}
          resizeMode={'contain'}
        />
      </ImageBackground>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  topView: {
    backgroundColor: Colors.white,
    height: hp(30),
    width: wp(100),
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
