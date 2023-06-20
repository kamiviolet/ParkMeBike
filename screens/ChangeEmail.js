import React, { useState, useContext } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config';
import { ThemeContext } from '../providers/ThemeProvider';

export const ChangeEmail = ({ route, navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [newEmail, setNewEmail] = useState('');
  const { userId } = route.params;

  const handleSave = () => {
    const userDocRef = doc(collection(db, 'users'), userId);
    updateDoc(userDocRef, { email: newEmail })
      .then(() => {
        console.log('User email updated!');
        navigation.goBack();
      })
      .catch((error) => console.log('Error updating user email!: ', error));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 16, marginBottom: 10, color: theme.text }}>Enter new email:</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        style={{
          height: 40,
          borderColor: 'lightgray',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
          color: theme.text,

          
          backgroundColor: theme.isLight ? 'grey' : 'white',
        }}
      />
      <Button title="Save" onPress={handleSave} />
      
    </View>
  );
};
