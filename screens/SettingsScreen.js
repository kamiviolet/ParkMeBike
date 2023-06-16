import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { ThemeContext } from '../providers/ThemeProvider';

import { Button } from 'react-native';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ color: theme.text }}>Settings Screen</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};

export default SettingsScreen;
