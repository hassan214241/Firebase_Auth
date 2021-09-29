import React, {useState, useEffect} from 'react';
import {AppStack} from './stacks/app.stack';
import {AuthStack} from './stacks/auth.stack';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        //logged in
        setIsLoggedIn(true);
      } else {
        //logged out
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
