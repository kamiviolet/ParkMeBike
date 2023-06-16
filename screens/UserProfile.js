import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button } from 'react-native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'uuid';
import { db } from '../config';

import { signOut } from 'firebase/auth';

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => { //returns a promise that resolves with blob object, make http requests in js
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed!'));
    };
    xhr.responseType = 'blob'; 
    xhr.open('GET', uri, true); // 
    xhr.send(null); //set to null GET requests don't have body
  });
};

const uploadImageAsync = (uri) => {
  return uriToBlob(uri).then((blob) => { //calls blob passes uri to it
    const fileRef = ref(getStorage(), `profileImages/${uuid.v4()}`);
    return uploadBytes(fileRef, blob).then(() => { //when blob is ready, uploads to firebase storage
      blob.close(); //frees up memory
      return getDownloadURL(fileRef); //gets download url of image
    });
  });
};

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = () => {
    if (!userId) {
      console.log('User ID is undefined');
      return;
    }

    const userDocRef = doc(collection(db, 'users'), userId);

    getDoc(userDocRef)
      .then((userDocSnap) => {
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            name: userData.name,
            email: userData.email,
            profileImage: userData.profileImage,
            location: userData.location,
            // other user stuff
          });
        }
      })
      .catch((error) => console.log('Error fetching user data!: ', error));
  };
  //asking permission to access device media library
  const handleProfileImageUpload = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then((permissionResult) => {
        if (!permissionResult.granted) {
          alert('Permission to access camera roll is required!');
          return;
        }

        return ImagePicker.launchImageLibraryAsync();
      })
      .then((pickerResult) => {
        if (pickerResult && !pickerResult.canceled) {
          setNewProfileImage(pickerResult.assets[0].uri);
        }
      })
      .catch((error) => console.log('Error during image selection!: ', error));
  };

  const handleSave = () => {
    const userDocRef = doc(collection(db, 'users'), userId);
    const userData = { name: newName, location: newLocation };

    if (newProfileImage) {
      uploadImageAsync(newProfileImage)
        .then((downloadURL) => {
          userData.profileImage = downloadURL;
          return updateDoc(userDocRef, userData);
        })
        .then(() => {
          console.log('User data updated!');
          fetchUserData();
        })
        .catch((error) => console.log('Error updating user data!: ', error));
    } else {
      updateDoc(userDocRef, userData)
        .then(() => {
          console.log('User data updated!');
          fetchUserData();
        })
        .catch((error) => console.log('Error updating user data!: ', error));
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {newProfileImage ? (
        <Image source={{ uri: newProfileImage }} style={styles.profileImage} />
      ) : (
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
      )}
      <Button
        title="Upload Profile Picture"
        onPress={handleProfileImageUpload}
        color="#ffc93c"
      />
      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Name"
        style={styles.input}
        color="#000"
        backgroundColor="#fff"
      />
      <TextInput
        value={newLocation}
        onChangeText={setNewLocation}
        placeholder="Location"
        style={styles.input}
        color="#000"
        backgroundColor="#fff"
      />
      <Button title="Save Changes" onPress={handleSave} color="#ffc93c" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07689f',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 30,
    borderColor: '#fff',
    borderWidth: 4,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
