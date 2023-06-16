import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './providers/ThemeProvider';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';

const App = () => {
  return (
    <ThemeProvider>
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
};

export default App;
