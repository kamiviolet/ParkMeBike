import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../providers/ThemeProvider';

// About
export const AboutUs = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.text, {color: theme.text}]}>We're Team Smashcoders and we made this app so that you can park your bike!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  text: {
    fontSize: 20,
    
  },
});
