import React from 'react';
import {View, ImageBackground, Image, StyleSheet} from 'react-native';
import {Colors, hp, wp} from '../../constant/colors';

const Header = () => {
  return (
    <View style={styles.topView}>
      <ImageBackground
        source={{uri: 'logo_background'}}
        style={{height: '100%', width: '100%', ...styles.common}}
        resizeMode={'cover'}>
        <Image
          source={{uri: 'logo'}}
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
