import { useState, useContext } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config';
import { ThemeContext } from '../providers';

export const ChangeEmail = ({ route, navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [newEmail, setNewEmail] = useState('');
  const { userId } = route.params;

  const handleSave = () => {
    const userDocRef = doc(collection(db, 'users'), userId);
    updateDoc(userDocRef, { email: newEmail })
      .then(() => navigation.goBack())
      .catch((error) => console.log('Error updating user email!: ', error));
  };

  return (
    <View className="flex-1 justify-center w-screen p-10 bg-white">
      <Text className="text-base" style={{color: theme.text }}>
        Enter new email:
      </Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        className='h-10 border-gray-300 border-px rounded my-8 pl-2 text-black'
        style={{backgroundColor: theme.name == 'light' ? 'lightgrey' : 'white'}}
      />
      <TouchableOpacity
        onPress={handleSave}
        className='items-center py-1 px-2 my-8 rounded'
        style={{ backgroundColor: theme.primary }}
      >
        <Text className='text-white text-2xl'>Save</Text>
      </TouchableOpacity>
    </View>
  );
};