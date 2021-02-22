import React from 'react';
import {Image, Pressable, View, Text, StyleSheet} from 'react-native';
import {boxShadow, Colors, wp} from '../constant/colors';

const SimpleHeader = (props) => {
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
                onPress={() => {
                    props.navigation.goBack();
                }}>
                <Image
                    source={require('../assets/images/menu_icon.png')}
                    resizeMode={'contain'}
                    style={{
                        height: 20,
                        width: 20,
                    }}
                />
            </Pressable>
            <View style={{width: wp(87), height: '100%', ...styles.common}}>
                <Text style={{
                    fontFamily: 'Gilroy-Medium',
                    fontSize: wp(5),
                    color: Colors.inputTextColor,
                    marginRight: wp(13)
                }}>{props.headerText}</Text>
            </View>
        </View>
    )
}

export default SimpleHeader;

const styles = StyleSheet.create({
    common: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})