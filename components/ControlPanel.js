import {StyleSheet, View, Text, Pressable, Button} from 'react-native'
import { Slider, Icon } from '@rneui/themed';
import { color } from 'react-native-reanimated';



const ControlPanel = ({setLocationParams, locationParams, parkingLimit, setParkingLimit, setModalVisible})=>{
   
    return (
        <>
        <View style={styles.sliderWrapper}>
        <Text style={styles.heading}>Radius</Text>
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
    <Text style={styles.label}>{locationParams.radius} km</Text>
    <Text style={styles.heading}>Bike Parks</Text>
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
    <Text style={styles.label}>{parkingLimit} bike parks</Text>
    <Button title="close" onPress={()=>{setModalVisible(false)}}>Close</Button>
    </View>
    </>
    )
}

const styles = StyleSheet.create({
    sliderWrapper: {
        // position: 'absolute',
        // paddingHorizontal: 20,
        // top: 40,
        // zIndex: 3,
        // width: '100%',
        // backgroundColor: '#000000c0',
        // borderRadius: 20,   
     
        position: 'absolute',
        paddingHorizontal: 20,
        bottom: 50, 
        zIndex: 3,
        width: '100%',
        height: 280, 
        backgroundColor: '#000000c0',
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,    
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
      },
      label: {
        color: 'white'
      },
      heading: {
        padding: 12,
        color: 'white',
        fontSize: 20
      }

    
})

export default ControlPanel;