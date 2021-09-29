import React from 'react';
import {Button, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';

const LogoutUser = async () => {
  try {
    let logout = await auth().signOut();
  } catch (error) {
    console.log('error', error);
  }
};

export const Chat = () => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Chat Screen!</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="SIGN OUT" onPress={() => LogoutUser()} />
      </View>
    </View>
  );
};
