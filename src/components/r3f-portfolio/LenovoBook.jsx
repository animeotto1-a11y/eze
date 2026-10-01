import React from 'react';
import { meshBounds } from '@react-three/drei';

export default function LenovoBook({ nodes, materials, refName }) {
  if (!nodes || !nodes.Macbook) return null;

  return (
    <mesh
      name="LenovoBook"
      geometry={nodes.Macbook.geometry}
      material={materials.PaletteMaterial001}
      position={[0, 0.519, 0]}
      scale={0.103}
      ref={refName}
      raycast={meshBounds}
    >
      <group
        name="Top"
        position={[0.007, -0.472, -10.412]}
        rotation={[1.358, 0, 0]}
        scale={5.796}
      >
        {nodes.Circle002 && (
          <mesh
            name="Circle002"
            geometry={nodes.Circle002.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
        {nodes.Circle002_1 && (
          <mesh
            name="Circle002_1"
            geometry={nodes.Circle002_1.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
        {nodes.Circle002_2 && (
          <mesh
            name="Circle002_2"
            geometry={nodes.Circle002_2.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
        {nodes.Circle002_3 && (
          <mesh
            name="Circle002_3"
            geometry={nodes.Circle002_3.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
        {nodes.Circle002_4 && (
          <mesh
            name="Circle002_4"
            geometry={nodes.Circle002_4.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
        {nodes.Circle002_5 && (
          <mesh
            name="Circle002_5"
            geometry={nodes.Circle002_5.geometry}
            material={materials.PaletteMaterial001}
          />
        )}
      </group>
    </mesh>
  );
}
