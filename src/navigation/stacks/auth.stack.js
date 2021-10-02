import {createStackNavigator} from '@react-navigation/stack';
import {Login} from '../../screens/login';
import {Signup} from '../../screens/signup';
import React from 'react';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

export const AuthStack = () => {
  return (
    <Navigator>
      <Screen name="Login" component={Login} options={{headerShown: false}} />
      <Screen name="Signup" component={Signup} options={{headerShown: false}} />
    </Navigator>
  );
};
