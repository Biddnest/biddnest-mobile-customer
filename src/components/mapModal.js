import React from 'react';
import {Modal, View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {wp, hp} from '../constant/colors';

const MapModal = (props) => {
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
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.modalView}>
          {props.children}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default MapModal;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
    width: wp(100),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingHorizontal: 10,
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
