import React from 'react';
import {Modal, View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {wp, hp, Colors} from '../constant/colors';

const MapModalAndroid = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={styles.centeredView}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            style={styles.modalView}>
            {props.children}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MapModalAndroid;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: wp(100),
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
