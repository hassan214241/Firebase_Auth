import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-paper';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const LoginUser = async (email, password) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

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

  GoogleSignin.configure({
    webClientId:
      '490715511962-1t5eq461bonlngvc1424emokveepilv3.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      alert('user not login with google');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#010a29'}}>
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={value => LoginUser(value.email, value.password)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <Image
                  source={require('../../assests/logo3.jpg')}
                  style={{width: 150, height: 150, borderRadius: 50}}
                />
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                  LOGIN
                </Text>
                <TextInput
                  style={styles.textInput}
                  name="email"
                  placeholder="Email Address"
                  placeholderTextColor="#003f5c"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={{fontSize: 10, color: 'red'}}>
                    {errors.email}
                  </Text>
                )}
                <TextInput
                  style={styles.textInput}
                  name="password"
                  placeholder="Password"
                  placeholderTextColor="#003f5c"
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
                <Text></Text>
                <Button
                  onPress={handleSubmit}
                  icon={({color, size}) => (
                    <Icon name="login" color={'#fff'} size={20} />
                  )}
                  contentStyle={{
                    borderWidth: 2,
                    width: 200,
                    borderRadius: 10,
                    borderColor: '#fff',
                    backgroundColor: '#44b6e4',
                  }}
                  labelStyle={{color: '#fff'}}>
                  LOGIN
                </Button>
                <Text></Text>
                <Button
                  onPress={() => onGoogleButtonPress()}
                  contentStyle={{
                    borderWidth: 2,
                    width: 200,
                    borderRadius: 10,
                    borderColor: '#44b6e4',
                    backgroundColor: '#fff',
                  }}
                  labelStyle={{color: 'black'}}
                  icon={({color, size}) => (
                    <Icon name="google" color={'#44b6e4'} size={20} />
                  )}>
                  GOOGLE
                </Button>
                <Text></Text>
                <Button
                  labelStyle={{color: '#fff', fontSize: 16}}
                  onPress={() => navigate('Signup')}
                  icon={({color, size}) => (
                    <Icon name="arrow-right" color={'#fff'} size={20} />
                  )}>
                  SIGN UP
                </Button>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    width: '80%',
    margin: 10,
    backgroundColor: 'white',
    borderColor: '#81defc',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
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
