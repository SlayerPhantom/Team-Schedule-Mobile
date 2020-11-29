import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();
import Home from './Home';
import UserGroups from './UserGroups';
import Login from './Login';

function MyDrawer({navigation}) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="UserGroups" component={UserGroups} />
      {/* <Drawer.Screen name="Logout" component={Login} /> */}
    </Drawer.Navigator>
  );
}

export default MyDrawer;
