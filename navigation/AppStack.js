import { HomeScreen, UserProfile } from '../screens';

import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../providers';

const Stack = createStackNavigator();

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
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileWithAuth} />
    </Stack.Navigator>
  );
};
