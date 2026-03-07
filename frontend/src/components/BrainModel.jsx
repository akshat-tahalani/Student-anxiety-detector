import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Create a network of nodes that resembles a brain shape
export default function BrainModel() {
  const groupRef = useRef();
  
  // Generate random points within a rough spherical/brain-like volume
  const { nodes, connections } = useMemo(() => {
    const numNodes = 70;
    const tempNodes = [];
    
    for (let i = 0; i < numNodes; i++) {
        // Brain-like distribution: slightly elongated on Z, squeezed on X
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 2 + Math.random() * 0.5; // Roughly scale 2 to 2.5
        
        const x = radius * Math.sin(phi) * Math.cos(theta) * 0.7; // squish sideways
        const y = radius * Math.cos(phi) * 0.9;
        const z = radius * Math.sin(phi) * Math.sin(theta) * 1.2; // elongate forward/back
        
        tempNodes.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes that are close to each other
    const tempConnections = [];
    for (let i = 0; i < tempNodes.length; i++) {
        for (let j = i + 1; j < tempNodes.length; j++) {
            const dist = tempNodes[i].distanceTo(tempNodes[j]);
            if (dist < 1.2) {
                tempConnections.push([tempNodes[i], tempNodes[j]]);
            }
        }
    }

    return { nodes: tempNodes, connections: tempConnections };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, idx) => (
        <Sphere key={`node-${idx}`} args={[0.08, 16, 16]} position={pos}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#3b82f6" 
            emissiveIntensity={0.8}
            roughness={0.2} 
            metalness={0.8} 
          />
        </Sphere>
      ))}

      {connections.map((conn, idx) => (
        <Line
          key={`conn-${idx}`}
          points={conn}
          color="#60a5fa"
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}

      {/* Internal ambient glow */}
      <pointLight color="#3b82f6" intensity={2} distance={10} position={[0,0,0]} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
    </group>
  );
}
