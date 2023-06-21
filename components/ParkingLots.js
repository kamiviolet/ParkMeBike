import { Marker, Callout } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef } from 'react';
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
  showRoute,
}) {
  const [showPollution, setShowPollution] = useState(null);
  const marker = useRef(null)
  const [pinColor, setPinColor] = useState(null);
  const AIRPOLLUTIONMARKER = {
    good: 'green',
    ok: 'orange',
    bad: 'black',
  };

  // useEffect(() => {
  //   fetchPollution(geometry.coordinates[1], geometry.coordinates[0]).then(
  //     ({ list }) => {
  //       setShowPollution(list[0].main.aqi);
  //     }
  //   );
  // }, [geometry]);

  useEffect(()=>{
    if (geometry.coordinates[1] === isParked.latitude && geometry.coordinates[0] === isParked.longitude) {
      setPinColor('purple')
    } else {
      setPinColor('red')
    }
  }, [isParked])

  const saveGeoLocation = () => {


    const uid = auth.currentUser.uid;
    const userBikeGeoRef = doc(db, 'users', uid, 'bikeGeo', 'bikeLocation');
    const userParkingHistoryRef = collection(db, 'users', uid, 'parkingHistory');

    const locationData = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
      timestamp: serverTimestamp(),
    };


    const getBackMyBike = () => {
      setIsParked({
        latitude: null,
        longitude: null,
        parked: false
      });
      console.log('You got your bike back!')
      Alert.alert('You got your bike back!');
    }

  
      
      

    const handleOkPress = () => {

      // Save bikeLocation
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
    };
    if(isParked.parked && isParked.latitude === geometry.coordinates[1]) {
      Alert.alert(
        'Get your bike back?',
        'Press OK to confirm' ,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Okay', onPress: getBackMyBike },
        ])
    
    } else if(!isParked.parked){
      console.log("thumbnail geo",geometry.coordinates)
      console.log("state geo", isParked)
      Alert.alert(
        'Save Location?',
        'Are you sure you want to save your location?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Okay', onPress: handleOkPress },
        ]
      );
    } else {
      Alert.alert(
        'You parked your bike already!')
    }
  };
  return (
    <>
      <Marker
        style={styles.callout}
        ref={marker}
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
        title={properties.name}
        pinColor={pinColor}
        //     : showPollution <= 2
        //     ? AIRPOLLUTIONMARKER.good
        //     : showPollution === 3
        //     ? AIRPOLLUTIONMARKER.ok
        //     : AIRPOLLUTIONMARKER.bad
        // }
        onPress={
          showRoute
            ? (e) =>
                setDestination({ ...destination, ...e.nativeEvent.coordinate })
            : () => {}
        }
        //         onCalloutPress={() => saveGeoLocation()}
      >
        <Callout
          style={styles.callout}
          onPress={() => {
            console.log(geometry.coordinates);
            saveGeoLocation();
          }}
        >
          {isParked?.parked === true &&
          isParked?.longitude === geometry.coordinates[0] ? (
            <Text style={styles.getBike}>Get My Bike</Text>
          ) : (
              <Text style={styles.parkBike}>Park Here
              </Text>
          )}
            {Platform.OS === "ios" ? (
              <Image 
                style={styles.thumbnail}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
                }}
              />
            ) : (
              <WebView
                source={{
                  uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
                }}
              />
            )}
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
  callout: {
    borderColor: "blue",
    overFlow: "hidden",
    color: "white",
  },
  getBike: {
    backgroundColor: "#2196F3",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  parkBike: {
    backgroundColor: "#2196F3",
    fontWeight: "bold",
    textAlign: "center",
  },
});
