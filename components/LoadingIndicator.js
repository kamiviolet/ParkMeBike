import { ActivityIndicator } from 'react-native';
import View from './View';

export default function LoadingIndicator() {
  return (
    <View className="flex-1 place-items-center">
      <ActivityIndicator size='large' color={"#f97316"} />
    </View>
  );
};