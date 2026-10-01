import React, { useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';

export default function Captions({ isOpen, isPoweredOn, isFinishedBooting }) {
  const billboardRef = useRef();

  return (
    <Billboard ref={billboardRef} position={[0, -1.6, 0]}>
      {!isOpen && (
        <Text
          font="/fonts/titillium-web-v17-latin-regular.woff"
          fontSize={0.24}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          👆 Cliquez sur le bouton clignotant à gauche pour OUVRIR l'ordinateur
        </Text>
      )}

      {isOpen && !isPoweredOn && (
        <Text
          font="/fonts/titillium-web-v17-latin-regular.woff"
          fontSize={0.24}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          ⚡ Appuyez sur le bouton POWER (sur le clavier) pour ALLUMER l'écran
        </Text>
      )}

      {isOpen && isPoweredOn && !isFinishedBooting && (
        <Text
          font="/fonts/titillium-web-v17-latin-regular.woff"
          fontSize={0.22}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          Démarrage du système Studio Ezélia OS en cours...
        </Text>
      )}
    </Billboard>
  );
}
