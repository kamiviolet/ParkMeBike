import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'uuid';
import { db } from '../config';
import { auth } from '../config';
import { signOut } from 'firebase/auth';

const DeleteUserProfile = ({ onPress }) => (
  <Button title="Delete Profile" onPress={onPress} color="red" />
);

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    //returns a promise that resolves with blob object, make http requests in js
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
  return uriToBlob(uri).then((blob) => {
    //calls blob passes uri to it
    const fileRef = ref(getStorage(), `profileImages/${uuid.v4()}`); // uuid generates random unique id for the image
    return uploadBytes(fileRef, blob).then(() => {
      //when blob is ready, uploads to firebase storage
      blob.close(); //frees up memory
      return getDownloadURL(fileRef); //gets download url of image
    });
  });
};
//same as above with the bike image
const uploadBikeImageAsync = (uri) => {
  return uriToBlob(uri).then((blob) => {
    const fileRef = ref(
      getStorage(),
      `bikeImages/9d14d199-178a-412f-b978-41d741db901c`
    ); // uuid generates random unique id for the image
    return uploadBytes(fileRef, blob).then(() => {
      blob.close();
      return getDownloadURL(fileRef);
    });
  });
};

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newBikeImage, setNewBikeImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
            username: userData.username,
            email: userData.email,
            profileImage: userData.profileImage,
            location: userData.location,
            bikeImage: userData.bikeImage,
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
  //asking permission to open camera
  const handleCameraImageUpload = () => {
    ImagePicker.requestCameraPermissionsAsync()
      .then((permissionResult) => {
        if (!permissionResult.granted) {
          alert('Permission to access camera is required!');
          return;
        }

        ImagePicker.launchCameraAsync()
          .then((pickerResult) => {
            if (pickerResult && !pickerResult.canceled) {
              setNewBikeImage(pickerResult.assets[0].uri);
            }
          })
          .catch((error) =>
            console.log('Error during the picture capture: ', error)
          );
      })
      .catch((error) =>
        console.log('Error requesting camera permissions!: ', error)
      );
  };

  const handleSave = () => {
    const userDocRef = doc(collection(db, 'users'), userId);
    const userData = { location: newLocation };

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
    } else if (newBikeImage) {
      uploadBikeImageAsync(newBikeImage)
        .then((downloadURL) => {
          userData.bikeImage = downloadURL;
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
  const handleDeleteProfile = async () => {
    const userDocRef = doc(collection(db, 'users'), userId);
    try {
      (await deleteDoc(userDocRef)) && (await auth.currentUser.delete());
      if (user?.profileImage) {
        const fileRef = ref(getStorage(), user.profileImage);
        await deleteObject(fileRef);
      }
      auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.log('error deleting your profile');
    }
  };
  // const deleteAccount = async () => {
  //   try {
  //     await auth.currentUser.delete();
  //     console.log("deleted");
  //   } catch (error) {
  //     console.log("not deleted");
  //   }
  // };

  const deleteAccount = async () => {
    try {
      const confrimDeletion = await new Promise((resolve) => {
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
              text: 'yes',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: false }
        );
      });
      if (confrimDeletion) {
        await auth.currentUser.delete();
      }
      console.log('deleted');
    } catch (error) {
      console.log('not deleted');
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
      ) : user && user.profileImage ? (
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require('../assets/profile-placeholder.png')}
          style={styles.profileImage}
        />
      )}

      <Text style={styles.usernameStyle}>{user.username}</Text>

      <Text style={styles.textStyle} onPress={handleProfileImageUpload}>
        Upload Profile Picture
      </Text>

      <TextInput
        value={user.email}
        editable={false}
        placeholder="Email"
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
      <DeleteUserProfile title="Delete" onPress={deleteAccount} color="red" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {newBikeImage ? (
              <Image
                source={{ uri: newBikeImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: user.bikeImage }}
                style={styles.bikeImage}
              />
            )}

            <Text style={styles.textStyle} onPress={handleCameraImageUpload}>
              Take Bike Image
            </Text>

            <Text
              style={styles.textStyle}
              onPress={() => setModalVisible(!modalVisible)}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>

      <Text style={styles.textStyle} onPress={() => setModalVisible(true)}>
        Take Bike Image
      </Text>

      <Text style={styles.textStyle} onPress={handleSave}>
        Save Changes
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
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginBottom: 30,
    borderColor: '#fff',
    borderWidth: 3,
  },
  usernameStyle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  textStyle: {
    color: '#2196f3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
  },
  bikeImage: {
    width: 200,
    height: 200,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
