import { useState, useContext } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
      .then(() => {
        console.log('User email updated!');
        navigation.goBack();
      })
      .catch((error) => console.log('Error updating user email!: ', error));
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ fontSize: 16, marginBottom: 10, color: theme.text }}>
        Enter new email:
      </Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        style={{
          height: 40,
          borderColor: 'lightgray',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
          paddingLeft: 10,
          backgroundColor: theme.isLight ? 'grey' : 'white',
          color: 'black',
        }}
      />
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
