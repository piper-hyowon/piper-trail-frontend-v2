import React, {useEffect} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';

interface BookProps {
    position: [number, number, number];
    scale: number;
    isDay: boolean;
}

const Book: React.FC<BookProps> = ({position, scale, isDay}) => {
    const gltf = useGLTF('/models/draco/book.glb');

    useEffect(() => {
        if (gltf?.scene) {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material instanceof THREE.MeshStandardMaterial) {
                        if (['text', 'paper'].includes(mesh.material.name)) {
                            mesh.material.emissive = new THREE.Color(0x8feba4);
                            mesh.material.emissiveIntensity = isDay ? 0.2 : 0.9;
                        } else {
                            mesh.material.emissiveIntensity = 0.01;
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
                    <boxGeometry args={[2, 0.3, 3]}/>
                    <meshStandardMaterial color="#8feba4"/>
                </mesh>
            </group>
        );
    }

    return <primitive object={gltf.scene.clone()} position={position} scale={[scale, scale, scale]}
                      rotation={[0, Math.PI/6, 0]}/>;
};

export default Book;