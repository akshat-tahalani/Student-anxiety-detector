import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function MovingStars() {
  const starsRef = useRef();

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005;
      starsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <Stars 
      ref={starsRef}
      radius={100} 
      depth={50} 
      count={5000} 
      factor={4} 
      saturation={0} 
      fade 
      speed={1} 
    />
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-slate-900">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <MovingStars />
      </Canvas>
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent pointer-events-none" />
    </div>
  );
}
