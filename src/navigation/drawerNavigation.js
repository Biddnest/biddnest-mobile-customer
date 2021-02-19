import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigation from './tabNavigation';
import {DrawerStackNavigator} from './stackNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={TabNavigation} />
      <Drawer.Screen name="AboutUs" component={DrawerStackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
