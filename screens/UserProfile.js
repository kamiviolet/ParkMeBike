import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
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
      <View
        className='w-screen h-screen items-center'
        style={{backgroundColor: theme.background}}>
        <View className='mt-10 w-64 h-64'>
          <Image
            className='self-center rounded w-full h-full' 
            source={
              newProfileImage
              ? {uri: newProfileImage}
              : user && user.profileImage
              ? {uri: user.profileImage}
              : require('../assets/profile-placeholder.png')
            }
          />
          <Pressable
            onPress={handleProfileImageUpload}
            className='absolute right-10 bottom-0 bg-white rounded-full p-5'
          >
            <FontAwesome name="camera" size={20} color="gray" />
          </Pressable>
        </View>
      
      <View className='my-3 px-10 w-screen'>
        <Text className='text-base' style={{ color: theme.text }}>
          Username
        </Text>

        <TextInput
          value={user.username}
          editable={false}
          className='bg-slate-100 text-black text-base rounded p-2 my-2 w-full h-12'
        />
      </View>

      <View className='my-3 px-10 w-screen'>
        <Text className='text-base' style={{ color: theme.text }}>
          Email address
        </Text>
        <TextInput
          value={user.email}
          editable={false}
          className='bg-slate-100 text-black text-base rounded p-2 my-2 w-full h-12'
        />
        <Text
          onPress={() => navigation.navigate('ChangeEmail', { userId })}
          className='text-blue-600 my-3'
        >
          Change Email
        </Text>
      </View>
      <View className='px-10 w-screen'>
        <TouchableOpacity
          style={{ backgroundColor: theme.primary }}
          onPress={goToHistoryScreen}
          className='py-3 px-2 my-3 rounded w-full shadow-black flex-row justify-center'
        >
            <FontAwesome
              name="history"
              size={24}
              color={theme.name === 'dark' ? 'black' : 'white'}
            />
            <Text
              className='text-xl font-extrabold ml-2'
              style={{ color: theme.name === 'dark' ? 'black' : 'white' }}
            >
              View your recent history
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className='py-3 px-2 my-3 rounded w-full shadow-black flex-row justify-center'
          style={{backgroundColor: theme.primary}} 
          onPress={() => setModalVisible(true)}
        >
            <FontAwesome
              name="camera"
              size={24}
              color={theme.name === 'dark' ? 'black' : 'white'}
            />
            <Text
              className='text-white text-xl font-extrabold ml-2'
              style={{ color: theme.name === 'dark' ? 'black' : 'white'}}
            >
              Take Bike Image
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className='py-3 px-2 my-3 rounded w-full shadow-black flex-row justify-center'
          style={{backgroundColor: theme.primary}} 
          onPress={handleSave}
        >
            <FontAwesome
              name="save"
              size={24}
              color={theme.name === 'dark' ? 'black' : 'white'}
            />
            <Text
              className='text-white text-xl font-extrabold ml-2'
              style={{ color: theme.name === 'dark' ? 'black' : 'white'}}
            >
              Save Changes
            </Text>
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
        <View>
          <View className='m-5 bg-white rounded p-8 items-center shadow-slate-900/20'>
              <Image
                source={
                  newBikeImage
                  ? { uri: newBikeImage }
                  : { uri: user.bikeImage }
                }
                className='w-64 h-64'
              />
            <Text
              className='font-bold text-center text-xl p-2 text-blue-700'
              onPress={handleCameraImageUpload}>
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
      <Text
        className='text-blue-700 font-bold text-xs p-10 text-center'
        onPress={handleSave}
      >
      </Text>
    </View>
    </ScrollView>
  );
};

