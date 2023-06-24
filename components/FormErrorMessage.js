import { Text } from 'react-native';

export default function FormErrorMessage({ error, visible }) {
  if (!error || !visible) {
    return null;
  }
  return <Text className="ms-15 text-red-600 text-base my-8 font-bold">{error}</Text>;
};