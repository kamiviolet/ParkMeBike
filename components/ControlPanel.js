import {StyleSheet, View, Text, Pressable, Button} from 'react-native'
import { Slider, Icon } from '@rneui/themed';



const ControlPanel = ({setLocationParams, locationParams, parkingLimit, setParkingLimit, setModalVisible})=>{
   
    return (
        <>
        <View style={styles.sliderWrapper}>
        <Text>Set the radius</Text>
        <Slider 
        style={styles.radiusSlider} 
        value={10}
        maximumValue={100} 
        minimumValue={1}
        minimumTrackTintColor='#ffffff'
        maximumTrackTintColor='#000000'
        step={1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="bicycle"
              type="font-awesome"
              size={20}
              reverse
              containerStyle={{bottom: 20, right: 20}}
            />
          )
        }}
        onSlidingComplete={(e)=>{
          setLocationParams({...locationParams, radius: e})
        }}
    />
    <Text>Value: {locationParams.radius}</Text>
    <Text>Bike Parking Places</Text>
      <Slider
        style={styles.limitSlider} 
        value={1}
        maximumValue={10} 
        minimumValue={1}
        minimumTrackTintColor='#ffffff'
        maximumTrackTintColor='#000000'
        step={1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="bicycle"
              type="font-awesome"
              size={20}
              reverse
              containerStyle={{bottom: 20, right: 20}}
            />
          )
        }}
        onSlidingComplete={(e)=>{
          setParkingLimit(e)
        }}
    />
    <Text>Value: {parkingLimit}</Text>
    <Button title="close" onPress={()=>{setModalVisible(false)}}>Close</Button>
    </View>
    </>
    )
}

const styles = StyleSheet.create({
    sliderWrapper: {
        position: 'absolute',
        paddingHorizontal: 20,
        top: 20,
        zIndex: 3,
        width: '100%',
        backgroundColor: 'purple'
      },
      radiusSlider: {
        // position: 'relative',
        // top: 20,
        zIndex: 3,
        width: '100%',
      },
      limitSlider: {
        // position: 'relative',
        // top: 70,
        zIndex: 3,
        width: '100%',
      }

    
})

export default ControlPanel;