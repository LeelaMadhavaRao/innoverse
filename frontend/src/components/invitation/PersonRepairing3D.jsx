import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const PersonRepairing3D = () => {
  const personRef = useRef();
  const toolRef = useRef();
  const sparksRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Person animation - working motion
    if (personRef.current) {
      personRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      personRef.current.position.y = Math.sin(time * 3) * 0.1;
    }
    
    // Tool movement - hammering motion
    if (toolRef.current) {
      toolRef.current.rotation.z = Math.sin(time * 8) * 0.3 - 0.2;
      toolRef.current.position.y = 0.5 + Math.sin(time * 8) * 0.1;
    }
    
    // Sparks animation
    sparksRefs.current.forEach((spark, index) => {
      if (spark) {
        spark.position.y = Math.sin(time * 5 + index) * 0.2;
        spark.rotation.z = time * 2 + index;
        spark.scale.setScalar(0.8 + Math.sin(time * 6 + index) * 0.4);
      }
    });
  });

  return (
    <group>
      {/* Person Body */}
      <group ref={personRef} position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 1.2]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        
        <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.2, -0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        
        <mesh position={[0.2, -0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      {/* Tool (Hammer) */}
      <mesh ref={toolRef} position={[-1, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <group>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.3, 0.15, 0.1]} />
            <meshStandardMaterial color="#6b7280" metalness={0.8} />
          </mesh>
        </group>
      </mesh>
      
      {/* Work Surface */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Sparks */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (sparksRefs.current[i] = el)}
          position={[
            -0.8 + Math.random() * 0.4,
            0.2 + Math.random() * 0.3,
            Math.random() * 0.4 - 0.2
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      
      {/* Tools scattered around */}
      <mesh position={[0.8, -0.8, 0.3]} rotation={[0.2, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      <mesh position={[-0.6, -0.8, -0.2]} rotation={[0.3, -0.3, 0.1]}>
        <boxGeometry args={[0.15, 0.05, 0.3]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      {/* Gear */}
      <mesh position={[0.5, -0.7, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} />
      </mesh>
    </group>
  );
};
