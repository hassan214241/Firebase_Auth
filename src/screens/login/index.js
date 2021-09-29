import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text, Image} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import Icone from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '490715511962-1t5eq461bonlngvc1424emokveepilv3.apps.googleusercontent.com',
});

const onGoogleButtonPress = async () => {
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    alert('user not login with google');
  }
};
const LoginUser = async (email, password) => {
  try {
    let UserLogin = await auth().signInWithEmailAndPassword(email, password);
    if (UserLogin) {
      console.log('user are login');
    } else {
      console.log('user email and password incorrect');
      // alert('user email and password incorrect');
    }
  } catch (error) {
    console.log('error', error);
    alert('user email and password incorrect');
  }
};

export const Login = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });
  const onSubmit = values => {
    Console.log('Data', values);
  };

  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', marginTop: 90}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={value => LoginUser(value.email, value.password)}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <>
              <Text>
                <Icone name="user" size={40} color="black" />
              </Text>
              <Text style={styles.LogInText}>LOGIN</Text>

              <TextInput
                style={styles.textInput}
                name="email"
                placeholder="Email Address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
              )}
              <TextInput
                style={styles.textInput}
                name="password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {errors.password && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.password}
                </Text>
              )}
              <Button onPress={handleSubmit} title="LOGIN" />

              <Button title="SIGN UP" onPress={() => navigate('Signup')} />
              <Button
                title="LOGIN WITH GOOGLE"
                onPress={() => onGoogleButtonPress()}
              />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    width: '75%',
    margin: 10,
    backgroundColor: 'white',
    // borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
  },
  LogInText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  LogImage: {
    width: 140,
    height: 90,
  },
});
