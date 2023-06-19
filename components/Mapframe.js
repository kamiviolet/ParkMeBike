import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Button,
  Dimensions
} from 'react-native'; // Import Map and Marker
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchParking } from '../utils/api';
import ParkingLots from './ParkingLots';
import ControlPanel from './ControlPanel';
import MapViewDirections from 'react-native-maps-directions'
import Icon from 'react-native-vector-icons/FontAwesome'

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
    longitude: null
  })
  const [showRoute, setShowRoute] = useState(false)
  const [showTraffic, setShowTraffic] = useState(false)
  


  useEffect(() => {
    fetchParking(locationParams, parkingLimit)
      .then(({ features }) => {
        setPointsOfInterest([...features]);
      })
      .catch((err) => console.log(err));
  }, [locationParams, parkingLimit]);


  if (locationParams.location != null) {
    return (
      // <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <MapView
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
          // initialRegion={{
          //     latitudeDelta: 0.0922,
          //     longitudeDelta: 0.0421,
          // }}
          // initialCamera={{
          //     latitude: locationParams.location.latitude,
          //     longitude: locationParams.location.longitude,
          //     latitudeDelta: 0.1,
          //     longitudeDelta: 0.1
          // }}
        >
          {
                        // pointsOfInterest.map(({properties, geometry}) => {
                        //      return <ParkingLots properties={properties} geometry={geometry} key={properties.id} destination={destination} setDestination={setDestination}/>
                        // })
                    }
                    <Marker
                      coordinate={currLocation}
                    />
                    { 
                        showRoute && destination.latitude
                      ? <>
                      <MapViewDirections 
                      origin={currLocation}
                      destination={destination}
                      apikey='AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4'
                      strokeWidth={4}
                      strokeColor='#111111'
                      mode='BICYCLING'
                      onReady={(result)=>{}}
                    /> 
                      </>
                      :
                      <></>
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
          />
        </Modal>
        <Pressable style={styles.controlButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
        <Icon size={35} name={'sliders'} style={styles.iconStyle}/>
        </Pressable>
      </View>
      // </SafeAreaView>
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
  }
});