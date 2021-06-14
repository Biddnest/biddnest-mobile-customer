import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Text,
  FlatList,
} from 'react-native';
import {wp, hp} from '../constant/colors';
import CloseIcon from './closeIcon';
import {STYLES} from '../constant/commonStyle';
import TextInput from './textInput';

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
      <View
        style={{
          flexDirection: 'row',
        }}>
        {props.onPress && <CloseIcon onPress={props.onPress} />}
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
      </View>
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
                style={[
                  styles.headerText,
                  {
                    fontFamily: 'Roboto-Regular',
                    marginTop: 5,
                    fontSize: wp(3.5),
                    textTransform: 'capitalize',
                  },
                ]}>
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
              style={[
                styles.headerText,
                {
                  fontFamily: 'Roboto-Regular',
                  marginTop: 5,
                  fontSize: wp(3.5),
                  textTransform: 'capitalize',
                },
              ]}>
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
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: wp(100),
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: wp(100),
    maxHeight: hp(80),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
