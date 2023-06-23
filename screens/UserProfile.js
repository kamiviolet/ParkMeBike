import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../providers';
import uuid from 'uuid';

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed!'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true); //
    xhr.send(null); 
  });
};

const uploadImageAsync = (uri) => {
  return uriToBlob(uri).then((blob) => {
    const fileRef = ref(getStorage(), `profileImages/${uuid.v4()}`);
    return uploadBytes(fileRef, blob).then(() => {
      blob.close();
      return getDownloadURL(fileRef);
    });
  });
};

const uploadBikeImageAsync = (uri) => {
  return uriToBlob(uri).then((blob) => {
    const fileRef = ref(
      getStorage(),
      `bikeImages/9d14d199-178a-412f-b978-41d741db901c`
    );
    return uploadBytes(fileRef, blob).then(() => {
      blob.close();
      return getDownloadURL(fileRef);
    });
  });
};

export const UserProfile = ({ userId, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newBikeImage, setNewBikeImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => fetchUserData(), [userId]);

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
        });
      }
    })
    .catch((error) => console.log('Error fetching user data!: ', error));
  };

  const handleProfileImageUpload = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then((permissionResult) => {
        if (!permissionResult.granted) {
          Alert.alert('Permission to access camera roll is required!');
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
          fetchUserData();
        })
        .catch((error) => console.log('Error updating user data!: ', error));
    } else if (newBikeImage) {
      uploadBikeImageAsync(newBikeImage)
        .then((downloadURL) => {
          userData.bikeImage = downloadURL;
          return updateDoc(userDocRef, userData);
        })
        .then(() => fetchUserData())
        .catch((error) => console.log('Error updating user data!: ', error));
    } else {
      updateDoc(userDocRef, userData)
        .then(() => {
          fetchUserData();
        })
        .catch((error) => console.log('Error updating user data!: ', error));
    }
  };

  const UploadImageIcon = ({ onPress }) => (
    <Pressable
      onPress={onPress}
      className='absolute bottom-35 right-0 bg-white rounded p-5'
    >
      <FontAwesome name="camera" size={20} color="gray" />
    </Pressable>
  );

  const goToHistoryScreen = () => {
    navigation.navigate('ParkingHistory');
  };
 
  if (!user) {
    return (
      <View className="bg-white">
        <Text className="text-blue-700 font-bold text-xs p-10 text-center">Loading user profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={true}>
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View>
        {newProfileImage ? (
          <Image
            source={{ uri: newProfileImage }}
            className='rounded-full border-3 border-white mb-3'
            style={{width: 250, height: 250}}
          />
        ) : user && user.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            className='rounded-full border-3 border-white mb-3'
            style={{width: 250, height: 250}}

          />
        ) : (
          <Image
            source={require('../assets/profile-placeholder.png')}
            className="w-25 h-25 rounded-full border-3 border-white mb-3"
            style={{width: 250, height: 250}}
          />
        )}
        <UploadImageIcon onPress={handleProfileImageUpload} />
      </View>

      <Text style={[styles.inputLabel, { color: theme.text }]}>
        Username
      </Text>

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
          <View style={styles.iconContainer}>
            <FontAwesome name="history" size={24} color={theme.mode === 'dark' ? 'black' : 'white'} />
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
          <View style={styles.iconContainer}>
            <FontAwesome name="camera" size={24} color={theme.mode === 'dark' ? 'black' : 'white'} />
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
          <View style={styles.iconContainer}>
            <FontAwesome name="save" size={24} color={theme.mode === 'dark' ? 'black' : 'white'} />
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
              className='text-blue-700 font-bold text-xs p-10 text-center'
              onPress={() => setModalVisible(!modalVisible)}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>
      <Text
        className='text-blue-700 font-bold text-xs p-10 text-center'
        onPress={() => setModalVisible(true)}
      >
      </Text>
      <Text className='text-blue-700 font-bold text-xs p-10 text-center' onPress={handleSave}>
      </Text>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bikeImage: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    marginTop: 30,
    width: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
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
