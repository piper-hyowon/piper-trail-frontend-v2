import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DuzzleLibProps {
  position: [number, number, number];
  scale: number;
  isDay: boolean;
}

const DuzzleLib: React.FC<DuzzleLibProps> = ({ position, scale, isDay }) => {
  const gltf = useGLTF("/models/christmas-6.gltf");

  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          const mesh = child as THREE.Mesh;
          const originalMaterial = child.material;
          const newMaterial = new THREE.MeshStandardMaterial({
            color: originalMaterial.color,
            map: originalMaterial.map,
            transparent: originalMaterial.transparent,
            opacity: originalMaterial.opacity,
            flatShading: true,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0,
          });

          child.material = newMaterial;

          if (isDay) {
            if (
              child.name.includes("창문불켜짐") ||
              child.name.includes("가로등")
            ) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#ffffff",
                emissive: "#ffffe0",
                emissiveIntensity: 1,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_주황")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#fc7f50",
                emissive: "#fc7f50",
                emissiveIntensity: 1.3,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_노랑")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#ed9121",
                emissive: "#ed9121",
                emissiveIntensity: 1.3,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_빨강")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#d64045",
                emissive: "#d64045",
                emissiveIntensity: 1.3,
                metalness: 0.3,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            }
          }
        }
      });
    }
  }, [gltf?.scene, isDay]);

  if (!gltf?.scene) {
    return (
      <group position={position} scale={scale}>
        {/* 폴백 Book 컴포넌트 */}
        <mesh>
          <boxGeometry args={[2, 0.3, 3]} />
          <meshStandardMaterial color="#8feba4" />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={gltf.scene.clone()}
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
};

export default DuzzleLib;
