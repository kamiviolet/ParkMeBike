import { StyleSheet, View, Text, Pressable, Button, Dimensions } from 'react-native';
import { Slider, Icon, CheckBox } from '@rneui/themed';
import { color } from 'react-native-reanimated';
import {Audio} from 'expo-av'
import {useState, useEffect, useContext} from 'react'
import {ThemeContext} from '../providers/ThemeProvider'


const ControlPanel = ({
  setLocationParams,
  locationParams,
  parkingLimit,
  setParkingLimit,
  setModalVisible,
  showTraffic,
  setShowTraffic,
  showRoute,
  setShowRoute,
  ratchetBellSound
}) => {
  const [pingBellSound, setPingBellSound] = useState();
  const {theme, toggleTheme} = useContext(ThemeContext);

  async function playPingBell(){
    console.log('Loading sound');
    const {pingBellSound} = await Audio.Sound.createAsync(require('../assets/bellping.mp3'), 
    {shouldPlay: true}
    );
    setPingBellSound(pingBellSound);
  }

  useEffect(()=>{
    return ratchetBellSound
    ? () => {
      console.log('unloading sound')
      sound.unloadAsync()
    }
    : undefined;
  }, [pingBellSound])
  return (
    <>
      <View style={theme.name === 'light' ? styles.sliderLightWrapper : styles.sliderDarkWrapper}>
        <Text style={theme.name === 'light' ? styles.lightHeading : styles.darkHeading}>Radius: {locationParams.radius} km</Text>
        <Slider
          style={styles.radiusSlider}
          value={locationParams.radius}
          maximumValue={100}
          minimumValue={1}
          minimumTrackTintColor= {theme.primary}
          maximumTrackTintColor= {theme.text}
          step={1}
          // allowTouchTrack
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
          thumbProps={{
            children: (
              <Icon
                name="bicycle"
                type="font-awesome"
                size={20}
                reverse
                containerStyle={{ bottom: 20, right: 20 }}
              />
            ),
          }}
          onSlidingComplete={(e) => {
            setLocationParams({ ...locationParams, radius: e });
          }}
        />
        <Text style={theme.name === 'light' ? styles.lightHeading : styles.darkHeading}>Bike Parks: {parkingLimit}</Text>
        <Slider
          style={styles.limitSlider}
          value={parkingLimit}
          maximumValue={10}
          minimumValue={1}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.text}
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
                containerStyle={{ bottom: 20, right: 20 }}
              />
            ),
          }}
          onSlidingComplete={(e) => {
            setParkingLimit(e);
          }}
        />
        <Text style={styles.label}></Text>
        <View style={styles.checkBoxStyle}>
        <CheckBox
          title="show route"
          checked={showRoute}
          onPress={() => setShowRoute(!showRoute)}
        />
        <CheckBox
          title="show traffic"
          checked={showTraffic}
          onPress={() => setShowTraffic(!showTraffic)}
        />
        </View>
        <Button
          title="close"
          onPress={() => {
            setModalVisible(false);
            playPingBell()
          }}
        >
          Close
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sliderDarkWrapper: {
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 20,
    bottom: Dimensions.get('screen').width * 0.15,
    width: '100%',
    backgroundColor: '#000000c0',
  },
  sliderLightWrapper: {
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 20,
    bottom: Dimensions.get('screen').width * 0.15,
    width: '100%',
    backgroundColor: '#ccccccc0',
  },
  radiusSlider: {
    width: '100%',
  },
  limitSlider: {
    width: '100%',
  },
  darkHeading: {
    paddingVertical: 10,
    color: 'white',
    fontSize: 15,
    fontWeight: 600
  },
  lightHeading: {
    paddingVertical: 10,
    color: '#000000',
    fontSize: 15,
    fontWeight: 600
  },
  btnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  }
});

export default ControlPanel;