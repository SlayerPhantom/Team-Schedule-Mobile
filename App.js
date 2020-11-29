import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Button, Text} from 'react-native';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import MyDrawer from './src/screens/MyDrawer';
import Group from './src/screens/Group';
import Forgot from './src/screens/Forgot';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login'}}
        />
        <Stack.Screen name="SchedulerApp" component={MyDrawer} />
        <Stack.Screen
          options={{title: 'Register'}}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{title: 'Forgot Password'}}
          name="Forgot Password"
          component={Forgot}
        />
        <Stack.Screen options={{title: 'Home'}} name="Home" component={Home} />
        <Stack.Screen
          options={{title: 'Group'}}
          name="Group"
          component={Group}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
