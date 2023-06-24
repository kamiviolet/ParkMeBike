import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Icon({ name, size, color, style }) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};
