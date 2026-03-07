import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ring, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Gauge3D({ value = 50, color = "#ef4444" }) {
  const outerRing = useRef();
  const pointerGroup = useRef();

  useFrame((state) => {
    if (outerRing.current) {
        outerRing.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  // Calculate angle for the pointer based on value (0-100 mapped to somewhat -135deg to +135deg)
  const pointerAngle = -Math.PI * 0.75 + (value / 100) * (Math.PI * 1.5);

  return (
    <group position={[0,0,0]} scale={[1.5, 1.5, 1.5]}>
      {/* Background Track */}
      <Ring args={[1.5, 1.7, 64]} position={[0, 0, -0.1]}>
        <meshStandardMaterial color="#334155" transparent opacity={0.5} roughness={0.8} />
      </Ring>
      
      {/* Animated Glowing Ring */}
      <Ring ref={outerRing} args={[1.65, 1.75, 64, 1, 0, Math.PI * 2 * (value/100)]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </Ring>

      {/* Pointer/Needle */}
      <group ref={pointerGroup} rotation={[0, 0, -pointerAngle]}>
        <mesh position={[0, 1.2, 0.1]}>
          <coneGeometry args={[0.08, 0.6, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <Text position={[0, -0.4, 0]} fontSize={0.6} color="#f8fafc" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor={color}>
        {value}%
      </Text>

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1.5} />
    </group>
  );
}
