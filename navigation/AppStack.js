import { HomeScreen, UserProfile } from '../screens';
import Dashboard from '../screens/Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';

import React, { useContext } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../providers';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// const Stack = createStackNavigator();

//gets the user ID and renders UserProfile with it
const UserProfileWithAuth = () => {
  const { user } = useContext(AuthenticatedUserContext);

  if (!user) {
    return null; //loading indicator
  }

  return <UserProfile userId={user.uid} />;
};

export const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
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
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarShowIcon: true,
        tabBarIndicatorStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarStyle: {
          backgroundColor: '#000000',
          height: 80, //tab bar height
        },
        tabBarLabelStyle: {
          marginBottom: 0,
          color: 'white', //text color

          fontSize: 14, //increase/decrease the text size
        },
        tabBarIconStyle: {
          marginTop: 0, // icon closer to the label
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileWithAuth} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
};
