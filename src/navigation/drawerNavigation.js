import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './drawerContent';
import TabNavigation from './tabNavigation';
import {wp} from '../constant/colors';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerStyle={{width: wp(80)}}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="TabNavigation" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
