import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Splash = (props) => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Login');
    }, 1500);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
