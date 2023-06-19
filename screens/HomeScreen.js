import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config';

export const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  const goToHistoryScreen = () => {
    navigation.navigate('ParkingHistory');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={goToHistoryScreen}>
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
      <Text style={styles.textStyle} onPress={handleLogout}>
        Sign Out
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  textStyle: {
    color: '#2196f3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    position: 'absolute',
    bottom: 20,
  },
});

export default HomeScreen;
