import { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as Location from 'expo-location';
import { Mapframe, LoadingIndicator } from '../components';

export function Dashboard() {
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
              accuracy: Location.Accuracy.High,
              distanceInterval: 10,
            },
            location => {
             setCurrLocation({latitude: location.coords.latitude, longitude: location.coords.longitude})
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
      <LoadingIndicator/>
    )
  }
    return (
      <View className='absolute top-0 left-0 right-0 bottom-0'>
        <Mapframe locationParams={locationParams} setLocationParams={setLocationParams} currLocation={currLocation}/>
      </View>
    );
};