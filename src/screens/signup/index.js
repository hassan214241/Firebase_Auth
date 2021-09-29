import React from 'react';
import {View, Button, Text} from 'react-native';
import {CustomInput} from '../../components/CustomInput';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Icone from 'react-native-vector-icons/AntDesign';

const createUser = async (email, password) => {
  try {
    let userCreate = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    if (userCreate) {
      console.log('user create successfully');
    } else {
      console.log('error');
    }
  } catch (error) {
    console.log('Error', error);
    alert('not create user');
  }
};
export const Signup = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const {navigate} = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', marginTop: 50}}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={values => createUser(values.email, values.password)}
          validationSchema={validationSchema}>
          {({handleSubmit, isValid}) => (
            <>
              <Text>
                <Icone name="user" size={40} color="black" />
              </Text>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'green'}}>
                SIGN UP
              </Text>
              <Field
                component={CustomInput}
                name="Full Name"
                placeholder="FullName"
              />
              <Field
                component={CustomInput}
                name="email"
                placeholder="Email Address"
              />

              <Field
                component={CustomInput}
                name="password"
                placeholder="Password"
                //onChangeText={value => setPassword(value)}
                secureTextEntry
              />

              <Button title="SIGN UP" onPress={handleSubmit} />
              <Button title="LOGIN" onPress={() => navigate('Login')} />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};
