import { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Pressable,
  Modal,
  Platform
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import { fetchParking } from '../utils/api';
import ControlPanel from './ControlPanel';
import ParkingLots  from './ParkingLots';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Audio } from 'expo-av'

export default function Mapframe({
  locationParams,
  setLocationParams,
  currLocation,
}) {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [parkingLimit, setParkingLimit] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState({
    latitude: null,
    longitude: null,
    distance: null
  })
  const [showRoute, setShowRoute] = useState(false)
  const [showTraffic, setShowTraffic] = useState(false)
  const [ratchetBellSound, setRachetBellSound] = useState();
  const [isParked, setIsParked] = useState({
    latitude: null,
    longitude: null,
    parked: false
  })
  const map = useRef()


  async function playRachetBell(){
    console.log('Loading sound');
    const {ratchetBellSound} = await Audio.Sound.createAsync(require('../assets/bellcutup.mp3'), 
    {shouldPlay: true}
    );
    setRachetBellSound(ratchetBellSound);
  }

  useEffect(()=>{
    return ratchetBellSound
    ? () => {
      console.log('unloading sound')
      sound.unloadAsync()
    }
    : undefined;
  }, [ratchetBellSound])
  

  useEffect(() => {
    fetchParking(locationParams, parkingLimit)
      .then(({ features }) => {
        setPointsOfInterest([...features]);
      })
      .catch((err) => console.log(err));
  }, [locationParams, parkingLimit]);


  if (locationParams.location != null) {
    return (
      <View className='w-screen h-full'>
        <MapView
          ref={map}
          provider={PROVIDER_GOOGLE}
          className='absolute top-0 bottom-0 left-0 right-0'
          onRegionChangeComplete={(e) => {
            setLocationParams({
              ...locationParams,
              location: { latitude: e.latitude, longitude: e.longitude },
            });
          }}
          showsScale={true}
          showsCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          showsTraffic={showTraffic}
          initialCamera={
            (Platform.OS === 'ios') 
            ? {
              latitude: currLocation.latitude,
              longitude: currLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
            : null}
        >
          {
            pointsOfInterest.map(({properties, geometry}) => {
                return <ParkingLots
                  showRoute={showRoute}
                  properties={properties}
                  geometry={geometry}
                  key={properties.id}
                  destination={destination}
                  setDestination={setDestination}
                  setIsParked={setIsParked}
                  isParked={isParked}
                />
            })
          }
          { 
            showRoute && destination.latitude
            ? <MapViewDirections 
              origin={currLocation}
              destination={{latitude: destination.latitude, longitude: destination.longitude}}
              apikey='AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4'
              strokeWidth={4}
              strokeColor='#111111'
              onReady={({distance})=>setDestination({...destination, distance: distance})}
            /> 
            :<></>
          }
        </MapView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <ControlPanel
            setLocationParams={setLocationParams}
            locationParams={locationParams}
            parkingLimit={parkingLimit}
            setParkingLimit={setParkingLimit}
            setModalVisible={setModalVisible}
            showRoute={showRoute}
            setShowRoute={setShowRoute}
            showTraffic={showTraffic}
            setShowTraffic={setShowTraffic}
            ratchetBellSound={ratchetBellSound}
          />
        </Modal>
        <Pressable
          className='absolute bottom-20 right-0 m-2 z-10 p-3 bg-blue-300 rounded-full'
          onPress={() => {
            playRachetBell()
            setModalVisible(!modalVisible)
            }}
        >
        <Icon size={35} name={'sliders'}/>
        </Pressable>
        {
          destination.latitude && showRoute
          ? <>
            <View className='absolute w-44 h-20 bg-slate-200 left-5 bottom-5 p-2'>
              <Text className='font-black pb-5'>Distance to Parking Lot:</Text>
              <Text>{destination.distance} km</Text>
            </View>
          </>
          : <></>
        }
        <Pressable
          style={isParked.parked? {backgroundColor: '#ffaf7a'}: {backgroundColor: '#cccccc'}}
          className='absolute bottom-40 right-0 m-2 z-10 p-3 rounded-full'
          disabled={isParked.parked? false: true}
          onPress={() => {
          map.current?.animateCamera({center:
          {latitude: isParked.latitude, longitude: isParked.longitude}, zoom: 15
          }, 2000)}}
        >
        <Icon size={35} name={'flag'}/>
        </Pressable>
      </View>
    );
  }
}