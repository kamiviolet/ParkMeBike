import { HomeScreen, UserProfile } from '../screens';
import SettingsScreen from '../screens/SettingsScreen';
import Dashboard from '../screens/Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { AuthenticatedUserContext } from '../providers';

const Tab = createBottomTabNavigator();

//gets the user ID and renders UserProfile with it
const UserProfileWithAuth = () => {
  const { user } = useContext(AuthenticatedUserContext);

  if (!user) {
    return null; //loading indicator
  }

  return <UserProfile userId={user.uid} />;
};

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'information-circle'
            : 'information-circle-outline';
        } else if (route.name === 'UserProfile') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Dashboard') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Settings') { 
            iconName = focused ? 'settings' : 'settings-outline';
          }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#000000',
        height: 60,
      },
      tabBarLabelStyle: {
        marginBottom: 0,
        color: 'white',
        fontSize: 12,
      },
      tabBarIconStyle: {
        marginTop: 0,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="UserProfile" component={UserProfileWithAuth} />
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
