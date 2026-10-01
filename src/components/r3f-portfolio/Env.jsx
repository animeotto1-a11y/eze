import React from 'react';
import { Environment } from '@react-three/drei';

export default function Env() {
  return (
    <Environment
      files={'/images/distribution_board_1k.jpg'}
      background={false}
      environmentIntensity={0.6}
    />
  );
}
