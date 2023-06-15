import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';// Import Map and Marker
import Mapframe from '../components/Mapframe';
import * as Location from 'expo-location';


export default function Dashboard() {
  const [currLocation, setCurrLocation] = useState({});
  const [locationParams, setLocationParams] = useState({
    location: {...currLocation},
    radius: 10,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      Location.requestForegroundPermissionsAsync()
      .then(({status}) => {
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        } else {
          Location.watchPositionAsync(
            {
              // Tracking options
              accuracy: Location.Accuracy.High,
              distanceInterval: 10,
            },
            location => {
             setCurrLocation(location)
            })
      }
        })
      .then(() => {
        (Location.getCurrentPositionAsync({}))
      .then((location) => {
        if(location == null) {
          fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper())
        } else {
          setCurrLocation({    
            latitude: location.coords.latitude, longitude: location.coords.longitude
          })
          setIsLoading(false)
        }
      })
      })
  }, []);

  if(isLoading){
    return(
      <Text>Fetching cycleparking...</Text>
    )
  }
    return (
      <>
      <View style={styles.parentContainer}>
        <Mapframe locationParams={locationParams} setLocationParams={setLocationParams} currLocation={currLocation}/>
      </View>
      </>
    );
};

const styles = StyleSheet.create({
  parentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});