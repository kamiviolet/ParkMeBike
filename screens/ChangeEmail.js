import React, { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config';

export const ChangeEmail = ({ route, navigation }) => {
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
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Enter new email:</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        style={{ height: 40, borderColor: 'lightgray', borderWidth: 1, borderRadius: 10, marginBottom: 10, }}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};






