import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { StyleSheet, Text, View, Image, Platform, Button, Toast} from 'react-native';// Import Map and Marker
import {WebView} from 'react-native-webview'
import {useState, useEffect} from 'react'
import {fetchPollution} from '../utils/api'


export default function ParkingLots({properties, geometry, destination, setDestination}) {
    const [showPollution, setShowPollution] = useState(null)

    const AIRPOLLUTIONMARKER = {
        good: 'green',
        ok: 'orange',
        bad: 'black',
      }

    useEffect(()=>{
        fetchPollution(geometry.coordinates[1], geometry.coordinates[0])
        .then(({list})=>{setShowPollution(list[0].main.aqi)})
    },[geometry])

    return (
        <>
            <Marker 
                coordinate={{
                    latitude: geometry.coordinates[1],
                    longitude: geometry.coordinates[0]
                }}
                title={properties.name}
                pinColor={
                    showPollution <= 2
                    ? AIRPOLLUTIONMARKER.good
                    : showPollution === 3
                    ? AIRPOLLUTIONMARKER.ok
                    : AIRPOLLUTIONMARKER.bad
                }
                onPress={(e)=>{setDestination(e.nativeEvent.coordinate)}}
                onCalloutPress={()=>console.log(geometry.coordinates)}
                
            >
            <Callout onPress={()=>{console.log(geometry.coordinates)}}>
            <Text>Park Here</Text>
            <View>
            {
                Platform.OS === 'ios' 
                ? <Image style={styles.thumbnail} source={{uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`}}/>
                : <WebView style={styles.thumbnail} source={{uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`}}/>
            }
            </View> 
            </Callout>  
            </Marker> 
        </>
    )
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 200,
        height: 200
    }
})
