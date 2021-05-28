import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Text,
} from 'react-native';
import {wp, hp} from '../constant/colors';
import CloseIcon from './closeIcon';
import {STYLES} from '../constant/commonStyle';

const CustomModalAndroid = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            if (props.onPress) {
              props.onPress();
            }
          }}>
          <View
            onStartShouldSetResponder={() => true}
            style={[
              styles.modalView,
              {maxHeight: props.maxHeight ? props.maxHeight : hp(80)},
            ]}>
            {props.title && (
              <Text style={STYLES.modalHeader}>{props?.title}</Text>
            )}
            {props.onPress && <CloseIcon onPress={props.onPress} />}
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}>
              {props.children}
            </ScrollView>
          </View>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default CustomModalAndroid;

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
