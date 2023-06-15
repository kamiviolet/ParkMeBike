import React from 'react';
import { View, StyleSheet, Button, Text, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


import { auth } from '../config';

import Pressable from './Pressable';

export const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  const handlePressProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handlePressDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <Text style={styles.title}>Welcome to Park Me Bike!</Text>
        <View style={styles.userProfile}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.userProfileImage}
          />
          <Text style={styles.userName}>Park Me Bike User</Text>
        </View>
        <Pressable style={styles.pressableButton} onPress={handlePressProfile}>
          <Text style={styles.buttonText}>User Profile</Text>
        </Pressable>
        <Pressable style={styles.pressableButton} onPress={handlePressDashboard}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </Pressable>
      </View>
      <View style={styles.signOutButton}>
        <Button title="Sign Out" onPress={handleLogout} color="#ffc93c" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07689f',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 80,
  },
  userProfile: {
    alignItems: 'center',
  },
  userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
  },
  pressableButton: {
    borderRadius: 10,
    backgroundColor: 'lightblue',
    marginTop: 20,
    padding: 8,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 200,
  },
});
