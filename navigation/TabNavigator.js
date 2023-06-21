import { AboutUs, UserProfile } from '../screens';
import SettingsScreen from '../screens/SettingsScreen';
import Dashboard from '../screens/Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { AuthenticatedUserContext } from '../providers';
import ParkingHistory from '../screens/ParkingHistory';
import { ThemeContext } from '../providers/ThemeProvider';

const Tab = createBottomTabNavigator();

//gets the user ID and renders UserProfile with it
const UserProfileWithAuth = ({navigation}) => {
  const { user } = useContext(AuthenticatedUserContext);

  if (!user) {
    return null; //loading indicator
  }

  return <UserProfile userId={user.uid} navigation={navigation} />;
};

const TabNavigator = () => {
  const {theme, toggleTheme} = useContext(ThemeContext)
  return(
  <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'About') {
          iconName = focused
            ? 'information-circle'
            : 'information-circle-outline';
        } else if (route.name === 'User Profile') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Dashboard') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: theme.background,
        height: 60,
      },
      tabBarLabelStyle: {
        marginBottom: 0,
        color: theme.text,
        fontSize: 12,
      },
      tabBarIconStyle: {
        color: theme.text,
        marginTop: 0,
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="User Profile" component={UserProfileWithAuth} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
    <Tab.Screen name="About" component={AboutUs} />
  </Tab.Navigator>
  )
};

export default TabNavigator;