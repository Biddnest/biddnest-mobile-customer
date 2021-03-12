import React from 'react';
import {Modal, View, StyleSheet, ScrollView} from 'react-native';
import {wp, hp, Colors} from '../constant/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const MapModalAndroid = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.centeredView}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.modalView}>
          {props.children}
        </ScrollView>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default MapModalAndroid;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
    width: wp(100),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    width: wp(100),
    maxHeight: hp(95),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
