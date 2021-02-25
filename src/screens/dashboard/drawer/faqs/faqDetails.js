import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
import {Colors, hp, SIDE_DRAWER, wp} from '../../../../constant/colors';
import SimpleHeader from '../../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FAQDetails = (props) => {
  const [openArray, setOpenArray] = useState([0]);
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.inputForm} key={index}>
        <View style={styles.flexBox}>
          <Text style={styles.topText}>{index + 1}. Test and save</Text>
          <Pressable
            onPress={() => {
              let temp = [...openArray];
              if (openArray.includes(index)) {
                const indexT = temp.indexOf(index);
                if (indexT > -1) {
                  temp.splice(indexT, 1);
                }
              } else {
                temp.push(index);
              }
              setOpenArray(temp);
            }}>
            <MaterialCommunityIcons
              name={openArray.includes(index) ? 'minus' : 'plus'}
              size={26}
              color={'#9A9FA4'}
            />
          </Pressable>
        </View>
        {openArray.includes(index) && (
          <View>
            <View style={styles.separatorView} />
            <Text style={styles.bottomText}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. Lorem ipsum dolor sit amet.
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'FAQS'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <View style={{flex: 1}}>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
  );
};

export default FAQDetails;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginVertical: hp(1.5),
  },
  topText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4),
    color: Colors.inputTextColor,
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.6),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
