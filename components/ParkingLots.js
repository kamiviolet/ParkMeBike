import { Marker, Callout } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  Image,
  Platform,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef } from 'react';
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
  const marker = useRef(null)
  const [pinColor, setPinColor] = useState(null);
  const [calloutText, setCalloutText] = useState('Park Here')

  useEffect(()=>{
    if (geometry.coordinates[1] === isParked.latitude && geometry.coordinates[0] === isParked.longitude) {
      setCalloutText('Get my Bike')
      marker.current.hideCallout()
      setPinColor('purple')
    } else {
      setCalloutText('Park Here')
      marker.current.hideCallout()
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
      Alert.alert('You got your bike back!');
    }
  
    const handleOkPress = () => {
      setDoc(userBikeGeoRef, locationData)
        .then(() => console.log('Bike location saved.'))
        .catch((error) => console.log('Error saving bike location:', error));

      addDoc(userParkingHistoryRef, locationData)
        .then(() => {
          setIsParked({
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
            parked: true,
          });
        })
        .catch((error) => console.log('Error saving parking spot:', error));
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
  }

  return (
    <Marker
      ref={marker}
      coordinate={{
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }}
      title={properties.name}
      pinColor={pinColor}
      onPress={
        showRoute
        ? (e) => setDestination({ ...destination, ...e.nativeEvent.coordinate })
        : () => {}
      }
    >
      <Callout
        className='text-white w-60 h-52 p-2'
        onPress={() => saveGeoLocation()}
      >
        <Text className='bg-blue-600 font-bold text-white py-2 mb-1 text-center'>{calloutText}</Text>
          {Platform.OS === "ios" 
          ? (
          <Image 
            className='w-full h-full'
            source={{
            uri: `https://maps.googleapis.com/maps/api/streetview?size=350x400&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
            }}
          />)
          : (
          <WebView
            className='w-full h-full'
            source={{
            uri: `https://maps.googleapis.com/maps/api/streetview?size=350x400&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`,
            }}
          />
          )}
      </Callout>
    </Marker>
  )
}