import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

const HeaderTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="bicycle" size={28} color="#fff" />
    <Text
      style={{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
      }}
    >
      Park Me Bike
    </Text>
  </View>
);

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerStyle: {
            backgroundColor: '#000000',
            height: 80,
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};
