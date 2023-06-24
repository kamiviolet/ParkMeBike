import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, FormErrorMessage } from '../components';
import { auth, db } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { doc, setDoc } from 'firebase/firestore';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [username, setUsername] = useState(''); 
  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = (values) => {
    const { username, email, password } = values;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { user } = userCredential;
        const { uid, email } = user;
  
        const userDocRef = doc(db, 'users', uid);
        setDoc(userDocRef, {username, email})
          .then(() => {
            return db.collection('users').doc(uid).get();
          })
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setUsername(data.username);
            } else {
              Alert.alert('No such user');
            }
          })
          .catch((error) => {
            Alert.alert('Something went wrong with adding user to Firestore or retrieving data:', error);
          });
      })
      .catch((error) => {
        setErrorState(error.message);
      });
  };

  return (
    <View className='bg-black h-screen justify-center flex-row items-center px-5'>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <Text className='text-3xl text-center font-extrabold text-white '>
          Create a new account!
        </Text>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              <TextInput
                name='username'
                leftIconName='account'
                placeholder='Enter username'
                autoCapitalize='none'
                keyboardType='default'
                textContentType='username'
                autoFocus={true}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
              <FormErrorMessage
                error={errors.username}
                visible={touched.username}
              />
              <TextInput
                name='email'
                leftIconName='email'
                placeholder='Enter email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name='password'
                leftIconName='key-variant'
                placeholder='Enter password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='newPassword'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
               <TextInput
                name='confirmPassword'
                leftIconName='key-variant'
                placeholder='Enter password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType='password'
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              <Button
                  className='w-full justify-center items-center my-2 py-3 bg-gray-500 rounded'
                  onPress={handleSubmit}>
                <Text className='text-xl text-white font-extrabold'>Signup</Text>
              </Button> 
            </>
          )}
        </Formik>
        <Button
          className='mt-10 items-center justify-center'
          borderless
          title={'Already have an account?'}
          onPress={() => navigation.navigate('Login')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};