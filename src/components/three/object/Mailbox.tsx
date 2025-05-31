import React, {useEffect, useState} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';

interface MailboxProps {
    position: [number, number, number];
    scale: number;
    isDay: boolean;
}

const Mailbox: React.FC<MailboxProps> = ({position, scale, isDay}) => {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [opened, setOpened] = useState(false);

    // 항상 hooks를 호출하되, try-catch로 에러 처리
    let gltf = null;
    let gltfError = false;

    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        gltf = useGLTF('/models/draco/mailbox.glb');
    } catch (error) {
        gltfError = true;
        console.warn('Mailbox GLTF model not found, using fallback');
    }

    useEffect(() => {
        if (gltf?.scene && !gltfError) {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material instanceof THREE.MeshStandardMaterial) {
                        if (mesh.material.name === 'postboxtext') {
                            mesh.material.emissive = new THREE.Color(0xffffff);
                            mesh.material.emissiveIntensity = isDay ? 0.2 : 0.7;
                        } else {
                            mesh.material.envMapIntensity = 0.7;
                            mesh.material.emissiveIntensity = -0.8;
                        }
                    }
                }
            });
            setModelLoaded(true);
        }
    }, [gltf?.scene, isDay, gltfError]);

    // GLTF 모델이 있고 로딩되었으면 사용, 없으면 폴백
    if (!gltfError && modelLoaded && gltf?.scene) {
        return (
            <primitive
                object={gltf.scene.clone()}
                position={position}
                scale={[scale, scale, scale]}
                rotation={[0, 5, 0]}
            />
        );
    }

    // 폴백 Mailbox 컴포넌트
    return (
        <group
            position={position}
            scale={scale}
            onClick={() => setOpened(!opened)}
            onPointerOver={() => setOpened(true)}
            onPointerOut={() => setOpened(false)}
        >
            {/* 우편함 본체 */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1, 0.8, 0.6]}/>
                <meshStandardMaterial color="#FF0000"/>
            </mesh>
            {/* 우편함 뚜껑 */}
            <mesh
                position={[0, 0.9, opened ? -0.2 : 0]}
                rotation={[opened ? -Math.PI * 0.3 : 0, 0, 0]}
            >
                <boxGeometry args={[1, 0.1, 0.6]}/>
                <meshStandardMaterial color="#8B0000"/>
            </mesh>
            {/* 기둥 */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1]}/>
                <meshStandardMaterial color="#333"/>
            </mesh>
        </group>
    );
};

export default Mailbox;