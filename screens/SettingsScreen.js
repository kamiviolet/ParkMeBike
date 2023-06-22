import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { auth, db } from '../config';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { ThemeContext } from '../providers/ThemeProvider';
import { Switch } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [toggle, setToggle] = useState(false);

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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.headingContainer}>
        <Text style={[styles.headingText, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.textStyle, { color: theme.text }]}>
          Toggle Theme
        </Text>
        <Switch
          value={toggle}
          onValueChange={() => {
            toggleTheme();
            setToggle(!toggle);
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogout}
        >
          <View style={styles.iconContainer}>
            <FontAwesome
              name="sign-out"
              size={24}
              color={theme.mode === 'dark' ? 'black' : 'white'}
            />
            <Text
              style={[
                styles.buttonText,
                {
                  color: theme.mode === 'dark' ? 'black' : 'white',
                  marginLeft: 10,
                },
              ]}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={deleteAccount}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="trash-o" size={24} color="white" />
            <Text
              style={[styles.buttonText, { color: 'white', marginLeft: 10 }]}
            >
              Delete Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  headingContainer: {
    marginBottom: 30,
  },
  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  textStyle: {
    fontSize: 18,
    marginRight: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    width: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 4,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 6.27,
    elevation: 0.8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
