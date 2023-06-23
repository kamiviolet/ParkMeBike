import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
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
      <View style={styles.container}>
        <MapView
          ref={map}
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
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
              apikey={process.env.GOOGLE_API}
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
        <Pressable style={styles.controlButton}
          onPress={() => {
            playRachetBell()
            setModalVisible(!modalVisible)
            }}
        >
        <Icon size={35} name={'sliders'} style={styles.iconStyle}/>
        </Pressable>
        {
          destination.latitude && showRoute
          ? <>
            <View style={{position: 'absolute', width: 175, minheight: 50, backgroundColor: '#b4cfec', left: 25, bottom: 25, padding: 10 }}>
              <Text style={{fontWeight: 800, paddingBottom: 10}}>Distance to Parking Lot:</Text>
              <Text>{destination.distance} km</Text>
            </View>
          </>
          : <></>
        }
        <Pressable style={isParked.parked? [styles.parkingButton, styles.abled]: [styles.parkingButton, styles.disabled] } disabled={isParked.parked? false: true}
          onPress={() => {
          map.current?.animateCamera({center:
          {latitude: isParked.latitude, longitude: isParked.longitude}, zoom: 15
          }, 2000)}}
        >
        <Icon size={35} name={'flag'} style={styles.iconStyle}/>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  controlButton: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    margin: 15,
    zIndex: 5,
    padding: 10,
    backgroundColor: '#2D8CFF',
    borderRadius: Dimensions.get('window').width * 0.5,
  },
  iconStyle: {
    color: '#ffffff'
  },
  bikeLocation: {
    zIndex: 7,
  },
  parkingButton: {
    position: 'absolute',
    bottom: 160,
    right: 0,
    margin: 15,
    zIndex: 5,
    padding: 10,
    borderRadius: Dimensions.get('window').width * 0.5,
  },
  abled: {
    backgroundColor: '#ffaf7a',
  },
  disabled: {
    backgroundColor: '#666666',
  }
});