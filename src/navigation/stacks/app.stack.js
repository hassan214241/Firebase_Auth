import {createStackNavigator} from '@react-navigation/stack';
import {Chat} from '../../screens/chat';
import {Message} from '../../screens/chat/Message';
import React from 'react';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

export const AppStack = () => {
  return (
    <Navigator>
      <Screen name="Chat" component={Chat} />
      <Screen
        name="Message"
        component={Message}
        options={({route}) => ({
          title: route.params.userName,
          headerBackTitleVisible: false,
        })}
      />
    </Navigator>
  );
};
