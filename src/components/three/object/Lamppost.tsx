import React, {useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

interface LamppostProps {
    position?: [number, number, number];
    scale?: number;
    isDay: boolean;
}

const Lamppost: React.FC<LamppostProps> = ({position = [0, 0, 0], scale = 1, isDay}) => {
    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame(() => {
        if (!isDay && lightRef.current) {
            lightRef.current.intensity = 0.8 + Math.random() * 0.2;
        }
    });

    return (
        <group position={position} scale={[scale, scale, scale]}>
            {/* 받침대 */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.2, 0.3, 0.2, 12]}/>
                <meshStandardMaterial color="#4b4b4b"/>
            </mesh>

            {/* 기둥 */}
            <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 2, 16]}/>
                <meshStandardMaterial color="#555"/>
            </mesh>

            {/* 장식*/}
            <mesh position={[0, 0.5, 0]}>
                <torusGeometry args={[0.07, 0.015, 8, 16]}/>
                <meshStandardMaterial color="#777"/>
            </mesh>
            <mesh position={[0, 2.25, 0]}>
                <sphereGeometry args={[0.06, 8, 8]}/>
                <meshStandardMaterial color="#666"/>
            </mesh>

            {/* 램프 헤드*/}
            <mesh position={[0, 2.4, 0]}>
                <coneGeometry args={[0.15, 0.2, 6]}/>
                <meshStandardMaterial color={isDay ? '#ccc' : '#ffffdd'} emissive={isDay ? '#000' : '#ffff99'}/>
            </mesh>

            {/* 유리구 */}
            <mesh position={[0, 2.55, 0]}>
                <sphereGeometry args={[0.1, 16, 16]}/>
                <meshStandardMaterial
                    color={isDay ? '#eee' : '#fffacd'}
                    transparent
                    opacity={isDay ? 0.3 : 0.8}
                    emissive={isDay ? '#000' : '#fff8b0'}
                />
            </mesh>

            {!isDay && (
                <pointLight
                    ref={lightRef}
                    position={[0, 2.55, 0]}
                    intensity={10}
                    distance={4}
                    color="#fff8b0"
                />
            )}
        </group>
    );
};

export default Lamppost;
