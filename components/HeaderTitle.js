import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HeaderTitle({theme}) {
    return (
      <View className="flex-row items-center">
        <Ionicons name="bicycle" size={28} color={theme.text}/>
        <Text className="font-bold text-lg ms-10 text-black">
          Park Me Bike
        </Text>
      </View>
    )
}