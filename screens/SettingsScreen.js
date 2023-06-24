import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { auth, db } from '../config';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { ThemeContext } from '../providers';
import { Switch } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';

export const SettingsScreen = () => {
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
    <ScrollView contentContainerStyle={{ backgroundColor: theme.background }}>
      <View className='flex-1 w-screen px-10 h-screen items-center justify-center pb-20'>
        <Text className='text-3xl pb-5 uppercase font-extrabold' style={{ color: theme.text }}>
          Settings
        </Text>

        <View className='flex-row items-center mb-5'>
          <Text className='text-xl p-2' style={{ color: theme.text }}>
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

        <TouchableOpacity
          className='py-2 my-2 rounded w-full shadow-slate-900/20'
          style={{ backgroundColor: theme.primary }}
          onPress={handleLogout}
        >
          <View className='flex-row justify-center items-center w-full'>
            <FontAwesome
              name="sign-out"
              size={24}
              color={theme.mode === 'dark' ? 'black' : 'white'}
            />
            <Text className='text-base font-bold text-white ml-1'>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='py-2 my-2 rounded w-full shadow-slate-900/20 bg-red-500'
          onPress={deleteAccount}
        >
          <View className='flex-row justify-center items-center w-full'>
            <FontAwesome name="trash-o" size={24} color="white" />
            <Text className='text-base font-bold text-white ml-1'>
              Delete Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};