import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';

export const Rocket3D = () => {
  const rocketRef = useRef();
  const flameRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rocket movement - launching upward
    if (rocketRef.current) {
      rocketRef.current.position.y = Math.sin(time * 0.5) * 0.5 + time * 0.8;
      rocketRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
    
    // Flame animation
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 10) * 0.3;
      flameRef.current.position.y = rocketRef.current?.position.y - 1.5 || -1.5;
    }
  });

  return (
    <group>
      {/* Rocket Body */}
      <mesh ref={rocketRef} position={[0, -2, 0]}>
        <coneGeometry args={[0.5, 3, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        
        {/* Rocket Tip */}
        <mesh position={[0, 1.8, 0]}>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Fins */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.7,
              -1.2,
              Math.sin((i * Math.PI) / 2) * 0.7
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.1, 0.8, 0.4]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        ))}
      </mesh>
      
      {/* Rocket Flame */}
      <mesh ref={flameRef} position={[0, -3.5, 0]}>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial 
          color="#f97316" 
          emissive="#f97316" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Exhaust particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 0.8,
            -4 - Math.random() * 2,
            (Math.random() - 0.5) * 0.8
          ]}
        >
          <sphereGeometry args={[0.05 + Math.random() * 0.05]} />
          <meshStandardMaterial
            color={Math.random() > 0.5 ? "#f97316" : "#fbbf24"}
            emissive={Math.random() > 0.5 ? "#f97316" : "#fbbf24"}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};
