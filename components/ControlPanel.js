import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import { Slider, Icon, CheckBox } from '@rneui/themed';
import { Audio } from 'expo-av';
import { ThemeContext } from '../providers';

export default function ControlPanel ({
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
}) {
  const [pingBellSound, setPingBellSound] = useState();
  const {theme, toggleTheme} = useContext(ThemeContext);

  async function playPingBell(){
    const pingBellSound = 
    await Audio.Sound.createAsync(require('../assets/bellping.mp3'), {shouldPlay: true});
    setPingBellSound(pingBellSound);
  }

  useEffect(()=>{
    return ratchetBellSound
    ? () => sound.unloadAsync()
    : undefined;
  }, [pingBellSound])

  return (
    <>
      <View className={
        theme.name === 'light'
        ? 'absolute px-5 py-5 bottom-16 w-screen bg-slate-200/80'
        : 'absolute px-5 py-5 bottom-16 w-screen bg-slate-600/80'
      }>
        <Text className={
          theme.name === 'light'
          ? 'py-2 text-black text-base font-bold'
          : 'py-2 text-white text-base font-bold'
        }>
          Radius: {locationParams.radius} km
        </Text>
        <Slider
          className='w-screen'
          value={locationParams.radius}
          maximumValue={30}
          minimumValue={1}
          minimumTrackTintColor= {theme.primary}
          maximumTrackTintColor= {theme.text}
          step={1}
          trackStyle={{ height: 5 }}
          thumbStyle={{ height: 20, width: 20 }}
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
          onSlidingComplete={(e) => setLocationParams({ ...locationParams, radius: e })}
        />
        <Text className={
          theme.name === 'light'
          ? 'py-2 text-black text-base font-bold'
          : 'py-2 text-white text-base font-bold'
        }>
          Bike Parks: {parkingLimit}
        </Text>
        <Slider
          className='w-screen'
          value={parkingLimit}
          maximumValue={10}
          minimumValue={1}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.text}
          step={1}
          allowTouchTrack
          trackStyle={{ height: 5 }}
          thumbStyle={{ height: 20, width: 20 }}
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
          onSlidingComplete={(e) => setParkingLimit(e)}
        />
        <View className='flex-row my-4 justify-between py-2'>
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
            playPingBell();
          }}
        />
      </View>
    </>
  );
};