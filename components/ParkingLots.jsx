import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Image} from 'react-native';// Import Map and Marker
// import bikeParkingIconSVG from '../assets/bikeParkIconSVG.svg'

export default function ParkingLots({properties, geometry}) {
    return (
       
        <>
            <Marker 
                coordinate={{
                    latitude: geometry.coordinates[1],
                    longitude: geometry.coordinates[0]
                }}
                title={properties.name}
            >
            <Callout>
            <Image style={styles.thumbnail} source={{uri: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${geometry.coordinates[1]},${geometry.coordinates[0]}&fov=80&heading=70&pitch=0&key=AIzaSyC8A14aH5FwMCQ9JYtDh9mPp0IFxKSdmT4`}}/> 
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

