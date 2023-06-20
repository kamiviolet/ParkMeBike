import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../config';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { ThemeContext } from '../providers/ThemeProvider';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

const deleteAccount = async () => {
    try {
      const confirmDeletion = await new Promise((resolve) => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: false }
        );
      });
      if (confirmDeletion) {
        const userDocRef = doc(collection(db, 'users'), user.uid);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.profileImage) {
            const fileRef = ref(getStorage(), userData.profileImage);
            await deleteObject(fileRef);
          }
        }
        await deleteDoc(userDocRef);
        await user.delete();
        console.log('Account deleted');
      }
    } catch (error) {
      console.log('Error deleting account: ', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ color: theme.text }}>Settings Screen</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Text style={styles.textStyle} onPress={handleLogout}>
        Sign Out
      </Text>
      <Text style={styles.textStyle} onPress={deleteAccount}>
        Delete Account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: '#2196f3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 20,
  },
});

export default SettingsScreen;