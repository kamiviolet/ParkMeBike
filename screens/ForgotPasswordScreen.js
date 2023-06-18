import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Pressable } from 'react-native';
import { passwordResetSchema } from '../utils';
import { Colors, auth } from '../config';
import { View, TextInput, Button, FormErrorMessage } from '../components';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = (values) => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Success: Password Reset Email sent.');
        navigation.navigate('Login');
      })
      .catch((error) => setErrorState(error.message));
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.screenTitle}>Reset your password</Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={(values) => handleSendPasswordResetEmail(values)}
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
            {/* Email input field */}
            <TextInput
              name="email"
              leftIconName="email"
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {/* Display Screen Error Mesages */}
            {errorState !== '' ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            {/* Password Reset Send Email  button */}
            <View style={styles.borderlessButtonContainer}>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.buttonText, { fontSize: 20 }]}>
                Send Reset Email
              </Text>
            </Pressable>
          </View>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <View style={styles.borderlessButtonContainer}>
<Pressable onPress={() => navigation.navigate('Signup')}>
  <Text style={[styles.buttonText, { fontSize: 20 }]}>
    Go back to Login
  </Text>
</Pressable>
</View>
    </View>





  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
  },
  innerContainer: {
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    paddingTop: 20,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  footer: {
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
