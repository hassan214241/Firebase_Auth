import { createStackNavigator } from "@react-navigation/stack";
import { Chat } from "../../screens/chat";
import React from "react";

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

export const AppStack = () => {
  return (
    <Navigator>
      <Screen name="Chat" component={Chat} />
    </Navigator>
  );
};

