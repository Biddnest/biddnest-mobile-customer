import React from 'react';
import {Modal, View, StyleSheet, ScrollView, Pressable} from 'react-native';
import {wp, hp} from '../constant/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.centeredView}>
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
              {
                // paddingTop: props.paddingTop ? props.paddingTop : 35,
                paddingTop: 0,
              },
            ]}>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
              style={styles.modalView}>
              {props.children}
            </ScrollView>
          </View>
        </Pressable>
      </KeyboardAwareScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
