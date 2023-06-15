import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Icon = ({ name, size, color, style }) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

<MaterialCommunityIcons name="bicycle" size={24} color="black" />;
