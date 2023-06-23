import { Image, StyleSheet } from 'react-native';

export default function Logo ({ uri }) {
  return <Image source={uri} className="w-200 h-200" />;
};