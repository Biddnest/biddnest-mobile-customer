import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Text,
  FlatList,
} from 'react-native';
import {wp, hp} from '../constant/colors';
import {STYLES} from '../constant/commonStyle';
import TextInput from './textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchableItem = (props) => {
  const {defaultInventories} = props;
  const [searchableList, setSearchableList] = useState(defaultInventories);
  const [searchText, setSearchText] = useState('');
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={props.visible}
      onRequestClose={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}>
      <SafeAreaView
        style={{
          flexDirection: 'row',
        }}>
        <View style={{width: wp(90)}}>
          <TextInput
            searchPress={() => {
              setSearchableList(defaultInventories);
              setSearchText('');
            }}
            icon={searchText === '' ? 'search' : 'close-outline'}
            isRight={'search'}
            value={searchText}
            placeHolder={'Search'}
            onChange={(text) => {
              let temp = defaultInventories.filter((item, index) => {
                if (item.name.toLowerCase().includes(text.toLowerCase())) {
                  return item;
                }
              });
              setSearchableList(temp);
              setSearchText(text);
            }}
          />
        </View>
        {props.onPress && (
          <Pressable
            onPress={props.onPress}
            style={{position: 'relative', top: hp(2)}}>
            <Ionicons name="close-sharp" size={hp(3.3)} color={'#C9CDCF'} />
          </Pressable>
        )}
      </SafeAreaView>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: hp(2),
          marginHorizontal: wp(5),
        }}
        data={searchableList}
        extraData={searchableList}
        renderItem={({item, index}) => {
          return (
            <Pressable
              style={styles.textWrapper}
              key={index}
              onPress={() => {
                setSearchableList(defaultInventories);
                setSearchText('');
                props.onConfirmPress({...item, itemName: null}, index);
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  marginTop: 5,
                  fontSize: wp(3.5),
                  textTransform: 'capitalize',
                }}>
                {item?.name}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={() => (
          <Pressable
            style={styles.textWrapper}
            onPress={() => {
              setSearchableList(defaultInventories);
              setSearchText('');
              props.onConfirmPress({
                label: '-Other-',
                value: 'other',
                id: null,
                material: '["wood","plastic","steel","fibre","glass"]',
                name: '-Other-',
                size: '["small","medium","large"]',
                itemName: searchText,
              });
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                marginTop: 5,
                fontSize: wp(3.5),
                textTransform: 'capitalize',
              }}>
              {'Add Custom Item - '}
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                }}>
                {searchText}
              </Text>
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => (
          <View style={[STYLES.separatorView, {marginBottom: hp(2)}]} />
        )}
      />
    </Modal>
  );
};

export default SearchableItem;

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
