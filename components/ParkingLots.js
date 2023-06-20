import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Button,
  Toast,
} from 'react-native'; // Import Map and Marker
import { WebView } from 'react-native-webview';
import { useState, useEffect } from 'react';
import { fetchPollution } from '../utils/api';
import { auth, db, collection, addDoc, setDoc, doc } from '../config';
import { serverTimestamp } from '@firebase/firestore';

export default function ParkingLots({
  properties,
  geometry,
  destination,
  setDestination,
  setIsParked,
  isParked,
}) {
  const [showPollution, setShowPollution] = useState(null);

  const AIRPOLLUTIONMARKER = {
    good: 'green',
    ok: 'orange',
    bad: 'black',
  };

  useEffect(() => {
    fetchPollution(geometry.coordinates[1], geometry.coordinates[0]).then(
      ({ list }) => {
        setShowPollution(list[0].main.aqi);
      }
    );
  }, [geometry]);

  const saveGeoLocation = () => {
    const uid = auth.currentUser.uid;

    const userBikeGeoRef = doc(db, 'users', uid, 'bikeGeo', 'bikeLocation');

    const userParkingHistoryRef = collection(
      db,
      'users',
      uid,
      'parkingHistory'
    );

    const locationData = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
      timestamp: serverTimestamp(),
    };

    // Save  bikeLocation
    setDoc(userBikeGeoRef, locationData)
      .then(() => {
        console.log('Bike location saved.');
      })
      .catch((error) => {
        console.log('Error saving bike location:', error);
      });

    // Save parking history
    addDoc(userParkingHistoryRef, locationData)
      .then((parkingSpotRef) => {
        setIsParked({
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
          parked: true,
        });
        console.log('Parking spot saved with ID:', parkingSpotRef.id);
      })
      .catch((error) => {
        console.log('Error saving parking spot:', error);
      });

    // if(!isParked.parked){
    //   setDoc(userBikeGeoRef, {
    //     latitude: geometry.coordinates[1],
    //     longitude: geometry.coordinates[0],
    //     timestamp: serverTimestamp(),
    //   })
    //     .then((parkingSpotRef) => {
    //       setIsParked({
    //         latitude: geometry.coordinates[1],
    //         longitude: geometry.coordinates[0],
    //         parked: true
    //       });
    //       console.log("Parking spot saved with ID:", parkingSpotRef);
    //     })
    //     .catch((error) => {
    //       console.log("Error saving parking spot:", error);
    //     });
    //   } else {
    //     setIsParked({
    //       latitude: null,
    //       longitude: null,
    //       parked: false
    //     });
    //     console.log("you got your bike back!");
    //   }
  };

  return (
    <>
      <Marker
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
        title={properties.name}
        pinColor={
          showPollution <= 2
            ? AIRPOLLUTIONMARKER.good
            : showPollution === 3
            ? AIRPOLLUTIONMARKER.ok
            : AIRPOLLUTIONMARKER.bad
        }
        onPress={(e) => {
          setDestination(e.nativeEvent.coordinate);
        }}
        onCalloutPress={() => {
          console.log(geometry.coordinates);

          saveGeoLocation();
        }}
      >
        <Callout
          onPress={() => {
            console.log(geometry.coordinates);
            saveGeoLocation();
          }}
        >
          {isParked?.parked === true &&
          isParked?.longitude === geometry.coordinates[0] ? (
            <Text>Get My Bike</Text>
          ) : (
            <Text>Park Here</Text>
          )}
          <View>
            {Platform.OS === 'ios' ? (
              <Image
                style={styles.thumbnail}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
                }}
              />
            ) : (
              <WebView
                style={styles.thumbnail}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
                }}
              />
            )}
          </View>
        </Callout>
      </Marker>
    </>
  );
}
const styles = StyleSheet.create({
  thumbnail: {
    width: 200,
    height: 200,
  },
});
