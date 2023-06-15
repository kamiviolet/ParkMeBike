import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Button,
} from 'react-native'; // Import Map and Marker
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchParking } from '../utils/api';
import ParkingLots from './ParkingLots';
import ControlPanel from './ControlPanel';

export default function Mapframe({
  locationParams,
  setLocationParams,
  currLocation,
}) {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [parkingLimit, setParkingLimit] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchParking(locationParams, parkingLimit)
      .then(({ features }) => {
        console.log(features[0].properties, 'features');
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
          // toolbarEnabled={true}
          showsTraffic={true}
          // showsIndoors={true}
          // initialRegion={{

          //     // latitudeDelta: 0.0922,
          //     // longitudeDelta: 0.0421,
          //     latitudeDelta: 0.1,
          //     longitudeDelta: 0.1
          // }}
          // initialCamera={{
          //     latitude: locationParams.location.latitude,
          //     longitude: locationParams.location.longitude,
          //     latitudeDelta: 0.1,
          //     longitudeDelta: 0.1
          // }}
        >
          {/* {
                        pointsOfInterest.map(({properties, geometry}) => {
                             return <ParkingLots properties={properties} geometry={geometry} key={properties.id} />
                        })
                    } */}
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
          />
        </Modal>
        <Button
          onPress={() => setModalVisible(!modalVisible)}
          title="ControlPanel"
        >
          Press me
        </Button>
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
});
