import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';
import { passwordResetSchema } from '../utils';
import { auth } from '../config';
import { View, TextInput, Button, FormErrorMessage } from '../components';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = (values) => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => setErrorState(error.message));
  };

   return (
    <View isSafe className='justify-center bg-slate-900 w-screen mx-20'>
      <View className=''>
        <Text className='text-2xl font-extra-bold text-black pt-2 text-center'>Reset your password</Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={values => handleSendPasswordResetEmail(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <>
             <TextInput
              name='email'
              leftIconName='email'
              placeholder='Enter email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
              {
              errorState !== ''
              ? <FormErrorMessage error={errorState} visible={true} />
              : null
              }
            <Button className='w-full place-items-center mt-1/2 p-2 rounded' onPress={handleSubmit}>
              <Text className='text-xl text-black font-extra-bold'>Send Reset Email</Text>
            </Button> 
          </>
        )}
      </Formik>
      <Button
        className='mt-2 place-items-center'
        borderless
        title={'Go back to Login'}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};