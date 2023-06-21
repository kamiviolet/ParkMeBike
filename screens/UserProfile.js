import React, { useEffect, useState, useContext } from 'react';
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
  TouchableOpacity,
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
import { FontAwesome } from '@expo/vector-icons';
import ParkingHistory from './ParkingHistory';
import { ThemeContext } from '../providers/ThemeProvider';

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

export const UserProfile = ({ userId, navigation }) => {
  const { theme } = useContext(ThemeContext);
  console.log(navigation);
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

  const UploadImageIcon = ({ onPress }) => (
    <Pressable onPress={onPress} style={styles.uploadImageIconContainer}>
      <FontAwesome name="camera" size={20} color="gray" />
    </Pressable>
  );

  const goToHistoryScreen = () => {
    navigation.navigate('ParkingHistory');
  };
 

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.profilePictureContainer}>
        {newProfileImage ? (
          <Image
            source={{ uri: newProfileImage }}
            style={styles.profileImage}
          />
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

        <UploadImageIcon onPress={handleProfileImageUpload} />
      </View>

      <Text style={[styles.inputLabel, { color: theme.text }]}>Username</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={user.username}
          editable={false}
          style={styles.input}
        />
      </View>
      <Text style={[styles.inputLabel, { color: theme.text }]}>
        Email address
      </Text>
      <View style={styles.inputContainer}>
        <TextInput value={user.email} editable={false} style={styles.input} />
      </View>
      <Text
        onPress={() => navigation.navigate('ChangeEmail', { userId })}
        style={styles.changeEmailLink}
      >
         Change Email
      </Text>

      <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.button, { backgroundColor: theme.primary }]}
    onPress={goToHistoryScreen}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome name="history" size={20} color={theme.mode === 'dark' ? 'black' : 'white'} />
      <Text style={[styles.buttonText, { color: theme.mode === 'dark' ? 'black' : 'white', marginLeft: 10 }]}>
        View your recent history
      </Text>
    </View>
  </TouchableOpacity>
</View>

<View style={styles.buttonContainer}>
  <TouchableOpacity 
    style={[styles.button, {backgroundColor: theme.primary}]} 
    onPress={() => setModalVisible(true)}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome name="camera" size={20} color={theme.mode === 'dark' ? 'black' : 'white'} />
      <Text style={[styles.buttonText, { color: theme.mode === 'dark' ? 'black' : 'white', marginLeft: 10 }]}>
        Take Bike Image
      </Text>
    </View>
  </TouchableOpacity>
</View>

<View style={styles.buttonContainer}>
  <TouchableOpacity 
    style={[styles.button, {backgroundColor: theme.primary}]} 
    onPress={handleSave}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome name="save" size={20} color={theme.mode === 'dark' ? 'black' : 'white'} />
      <Text style={[styles.buttonText, { color: theme.mode === 'dark' ? 'black' : 'white', marginLeft: 10 }]}>
        Save Changes
      </Text>
    </View>
  </TouchableOpacity>
</View>

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
        
      </Text>

      <Text style={styles.textStyle} onPress={handleSave}>
        
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },
  profilePictureContainer: {
    marginTop: 50,
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginBottom: 30,
    borderColor: '#fff',
    borderWidth: 3,
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

  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
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
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    height: 50,
    width: 300,
   
    margin: 5,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#F6F6F6',
    color: '#000',
  },

  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#000',

    marginLeft: 26,
    marginTop: 20,
  },
  changeEmailLink: {
    color: '#2196f3',
    marginLeft: 26,
    alignSelf: 'flex-start',
    fontSize: 14,
  },

  uploadImageIconContainer: {
    position: 'absolute',
    bottom: 35,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
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
