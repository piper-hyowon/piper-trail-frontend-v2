import React from 'react';
import * as THREE from 'three';

interface PalmTreeProps {
    position: [number, number, number];
    scale?: number;
}

const PalmTree: React.FC<PalmTreeProps> = ({position, scale = 1}) => {
    const treeScale = scale * 0.5;

    return (
        <group position={position} scale={treeScale}>
            {/* 나무 기둥 */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 4, 6]}/>
                <meshStandardMaterial color="#8b4513" roughness={0.8}/>
            </mesh>

            {/* 잎들 */}
            {Array.from({length: 8}).map((_, i) => (
                <group key={i} position={[0, 4, 0]} rotation={[0, (i * Math.PI * 2) / 8, 0]}>
                    <mesh rotation={[Math.PI * 0.2, 0, 0]}>
                        <coneGeometry args={[0.8, 3, 3]}/>
                        <meshStandardMaterial color="#228b22" side={THREE.DoubleSide} flatShading/>
                    </mesh>
                </group>
            ))}
        </group>
    );
};

export default PalmTree;