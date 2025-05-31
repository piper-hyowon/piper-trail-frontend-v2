import React, {useRef} from 'react';
import * as THREE from 'three';

interface LamppostProps {
    position?: [number, number, number];
    scale?: number;
}

const Lamppost: React.FC<LamppostProps> = ({position = [0, 0, 0], scale = 1}) => {
    const groupRef = useRef<THREE.Group>(new THREE.Group());

    // 곡선 생성을 위한 포인트들
    const points = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
            new THREE.Vector3(
                t, // x
                0.2 * Math.sin(t * Math.PI) + 4, // y
                0 // z
            )
        );
    }

    const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* 기둥 */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 4, 32]}/>
                <meshStandardMaterial color="#4a4a4a" roughness={0.7} metalness={0.3}/>
            </mesh>

            {/* 상단 곡선 부분 */}
            <primitive object={new THREE.Line(curveGeometry)}>
                <lineBasicMaterial color="#4a4a4a"/>
            </primitive>

            {/* 램프 갓 */}
            <mesh position={[1, 4, 0]} rotation={[0, 0, Math.PI / 2]}>
                <sphereGeometry args={[0.3, 32, 32, 0, Math.PI]}/>
                <meshStandardMaterial color="#ffffcc" transparent opacity={0.9} side={THREE.DoubleSide}/>
            </mesh>

            {/* 빛 */}
            <pointLight position={[1, 4, 0]} color="#ffffcc" intensity={10} distance={10}/>

            {/* 리본 장식 */}
            <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.2, 0.05, 16, 100]}/>
                <meshStandardMaterial color="#ff0000"/>
            </mesh>
        </group>
    );
};

export default Lamppost;