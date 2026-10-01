import React from 'react';

export default function RectLight({ lightRef, intensity = 2.5 }) {
  return (
    <rectAreaLight
      ref={lightRef}
      color="#fff8e7"
      intensity={intensity}
      width={3.5}
      height={2.2}
      position={[0, 1.4, -1.1]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
