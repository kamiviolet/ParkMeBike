import { useContext } from 'react';
import { AboutUs, UserProfile, SettingsScreen, Dashboard } from '../screens';
import { AuthenticatedUserContext, ThemeContext } from '../providers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const UserProfileWithAuth = ({navigation}) => {
  const { user } = useContext(AuthenticatedUserContext);

  if (!user) {
    return null    
  } else {
    return <UserProfile userId={user.uid} navigation={navigation} />
  };
};

export const TabNavigator = () => {
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