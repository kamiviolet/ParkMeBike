import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { collection, doc, getDoc } from 'firebase/firestore';

import { db } from '../config';

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
            setUser(userData);
          }
        })
        .catch((error) => {
          console.log('Error fetching user data: ', error);
        });
    };
  
    fetchUserData();
  }, [userId]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {/* Display additional user information */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
});

