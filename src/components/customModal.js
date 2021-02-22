import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import {wp, hp} from '../constant/colors';

const CustomModal = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.modalView}>
          {props.children}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: wp(100),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 35,
    paddingHorizontal: 10,
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
