import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db, collection, getDocs, addDoc, doc } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';

export const ParkingHistory = () => {
  const [parkingSpots, setParkingSpots] = useState([]);

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const collectionRef = collection(
      db,
      `users/${userId}/favourite-parking-spots`
    );

    getDocs(collectionRef)
      .then((querySnapshot) => {
        const spots = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setParkingSpots(spots);
      })
      .catch((error) => {
        console.log('Error retrieving parking spots:', error);
      });
  }, [userId]);

  const handleSaveParkingSpot = () => {
    if (!userId) {
      console.log('No user is logged in');
      return;
    }

    // We will need to replace these values with actual map data!

    const parkingSpot = {
      name: 'Lovely spot to grab a snack!',
      latitude: 12.345,
      longitude: 67.89,
    };

    addDoc(collection(db, `users/${userId}/favourite-parking-spots`), {
      name: parkingSpot.name,
      latitude: parkingSpot.latitude,
      longitude: parkingSpot.longitude,
    })
      .then((parkingSpotRef) => {
        console.log('Parking spot saved with ID:', parkingSpotRef.id);
      })
      .catch((error) => {
        console.log('Error saving parking spot:', error);
      });
  };

  return (
    <View style={styles.container}>
      {parkingSpots.map((spot) => (
        <View key={spot.id} style={styles.spotContainer}>
          <Text style={styles.spotName}>{spot.name}</Text>
          <Text>Latitude: {spot.latitude}</Text>
          <Text>Longitude: {spot.longitude}</Text>
        </View>
      ))}
      <Button onPress={handleSaveParkingSpot} title="Save Parking Spot!" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  spotContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ParkingHistory;
