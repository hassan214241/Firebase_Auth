import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {CustomInput} from '../../components/CustomInput';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const Signup = () => {
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

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const {navigate} = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: '#010a29'}}>
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={values => createUser(values.email, values.password)}
            validationSchema={validationSchema}>
            {({handleSubmit, isValid}) => (
              <>
                <Image
                  source={require('../../assests/logo3.jpg')}
                  style={{width: 100, height: 100, borderRadius: 50}}
                />
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                  SIGN UP
                </Text>
                <Field
                  component={CustomInput}
                  name="Full Name"
                  placeholder="FullName"
                  placeholderTextColor="#003f5c"
                />
                <Field
                  component={CustomInput}
                  name="email"
                  placeholder="Email Address"
                  placeholderTextColor="#003f5c"
                />

                <Field
                  component={CustomInput}
                  name="password"
                  placeholder="Password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry
                />
                <Text></Text>
                <Button
                  contentStyle={{
                    borderWidth: 2,
                    width: 200,
                    borderRadius: 25,
                    borderColor: '#fff',
                    backgroundColor: '#44b6e4',
                  }}
                  labelStyle={{color: '#fff'}}
                  icon={({color, size}) => (
                    <Icon name="login" color={'#fff'} size={20} />
                  )}
                  onPress={handleSubmit}>
                  SIGN UP
                </Button>
                <Text></Text>
                <Button
                  labelStyle={{color: '#fff', fontSize: 16}}
                  onPress={() => navigate('Signup')}
                  icon={({color, size}) => (
                    <Icon name="arrow-right" color={'#fff'} size={20} />
                  )}
                  onPress={() => navigate('Login')}>
                  LOGIN
                </Button>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};
