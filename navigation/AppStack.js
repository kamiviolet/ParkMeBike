import { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { ParkingHistory, ChangeEmail } from '../screens';
import { ThemeContext } from '../providers';
import { HeaderTitle } from '../components';

const Stack = createStackNavigator();

export const AppStack = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          headerTitle: (props) => <HeaderTitle {...props} theme={theme} />,
          headerStyle: {
            backgroundColor: theme.background,
            // color: theme.text,
            height: 80,
          },
          headerTintColor: theme.text,
        }}
      />
      <Stack.Screen
        name="ParkingHistory"
        component={ParkingHistory}
        options={{
          title: 'Parking History',
          headerStyle: {
            backgroundColor: theme.background,
            height: 80,
          },
          headerTintColor: theme.text,
        }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmail}
        options={{
          title: 'Change Email',
          headerStyle: {
            backgroundColor: theme.background,
            height: 80,
          },
          headerTintColor: theme.text,
        }}
      />
    </Stack.Navigator>
  );
};
