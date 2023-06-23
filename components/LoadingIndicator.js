import { ActivityIndicator, StyleSheet } from 'react-native';
import View from './View';

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={"#f97316"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
