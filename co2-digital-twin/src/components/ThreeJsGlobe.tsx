'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { CityData } from '@/types/dashboard';

interface City3DMarkerProps {
  city: CityData;
  onCitySelect: (city: CityData) => void;
  isSelected: boolean;
}

const City3DMarker: React.FC<City3DMarkerProps> = ({ city, onCitySelect, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Convert lat/lng to 3D coordinates on sphere
  const radius = 5;
  const phi = (90 - city.coordinates.lat) * (Math.PI / 180);
  const theta = (city.coordinates.lng + 180) * (Math.PI / 180);
  
  const position: [number, number, number] = [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];

  // Determine size and color based on emissions
  const emissionLevel = city.emissions.current;
  let scale = 0.1;
  let color = '#10b981';
  
  if (emissionLevel > 3) {
    scale = 0.2;
    color = '#ef4444';
  } else if (emissionLevel > 2) {
    scale = 0.15;
    color = '#f59e0b';
  }

  if (isSelected) {
    scale *= 1.5;
  }

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[scale, 8, 8]}
        onClick={() => onCitySelect(city)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Sphere>
      
      {(hovered || isSelected) && (
        <Text
          position={[0, scale + 0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="bottom"
        >
          {city.name}
        </Text>
      )}
    </group>
  );
};

interface Earth3DProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onCitySelect: (city: CityData) => void;
}

const Earth3D: React.FC<Earth3DProps> = ({ cities, selectedCity, onCitySelect }) => {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[5, 64, 64]}>
        <meshStandardMaterial 
          color="#1e40af"
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* City markers */}
      {cities.map(city => (
        <City3DMarker
          key={city.id}
          city={city}
          onCitySelect={onCitySelect}
          isSelected={selectedCity?.id === city.id}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        minDistance={8}
        maxDistance={20}
      />
    </>
  );
};

interface ThreeJsGlobeProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onCitySelect: (city: CityData) => void;
  className?: string;
}

export const ThreeJsGlobe: React.FC<ThreeJsGlobeProps> = ({
  cities,
  selectedCity,
  onCitySelect,
  className = ""
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-white text-lg">Loading 3D Globe...</div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg relative overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Earth3D 
          cities={cities}
          selectedCity={selectedCity}
          onCitySelect={onCitySelect}
        />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-3 rounded-lg text-white max-w-xs">
        <h4 className="text-sm font-semibold mb-2">3D Globe</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low emissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Medium emissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High emissions</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-xs opacity-80">Click markers • Drag to rotate • Scroll to zoom</p>
          </div>
        </div>
      </div>
    </div>
  );
};