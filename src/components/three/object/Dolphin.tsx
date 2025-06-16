import * as THREE from 'three'
import React, {useEffect, useRef, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import {useGLTF} from "@react-three/drei";
import {useEasterEgg} from "../../../context/EasterEggDolphinContext.tsx";

type DolphinProps = {
    position: [number, number, number]
    scale: number
    isDay: boolean
    onClick?: () => void
    maxDistance?: number // 최대 이동 거리
    clickableMinY?: number // 클릭 가능한 최소 Y 좌표 (점프 안 할 때 클릭은 무시하도록)
}

const Dolphin: React.FC<DolphinProps> = ({
                                             position,
                                             scale,
                                             isDay,
                                             onClick,
                                             maxDistance = 50,
                                             clickableMinY = -5,
                                         }) => {
    const gltf = useGLTF('/models/dolphin.gltf');
    const groupRef = useRef<THREE.Group | null>(null);
    const [isJumping, setIsJumping] = useState(false);
    const [jumpProgress, setJumpProgress] = useState(0);
    const [nextJumpTime, setNextJumpTime] = useState(Math.random() * 3 + 1);
    const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([...position]);
    const [isHovered, setIsHovered] = useState(false);
    const timeRef = useRef(0);
    const {setEasterEggUnlocked} = useEasterEgg();

    const handleClick = (event: any) => {
        event.stopPropagation();

        const currentY = groupRef.current?.position.y || 0;
        const isClickable = currentY > clickableMinY;

        console.log(`Dolphin clicked! Y: ${currentY}, Clickable: ${isClickable}`);

        if (onClick && isClickable) {
            setEasterEggUnlocked(true);
            localStorage.setItem('dolphinAccess', 'true');

            console.log('Easter egg unlocked!');

            setTimeout(() => {
                onClick();
            }, 100);
        } else if (!isClickable) {
            console.log('Dolphin must be jumping to click!');
        }
    };

    const handlePointerEnter = () => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerLeave = () => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
    };

    useEffect(() => {
        if (gltf?.scene) {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material instanceof THREE.MeshStandardMaterial) {
                        mesh.material.emissive = new THREE.Color(mesh.material.color);
                        mesh.material.emissiveIntensity = isDay ?
                            (isHovered ? 0.3 : 0) :
                            (isHovered ? 1.0 : 0.7);
                    }
                }
            });
        }
    }, [gltf?.scene, isDay, isHovered]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        timeRef.current += delta;

        if (!isJumping && timeRef.current >= nextJumpTime) {
            const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);

            setIsJumping(true);
            setJumpProgress(0);
            timeRef.current = 0;
        }

        if (isJumping) {
            setJumpProgress(prev => {
                const newProgress = prev + delta * 0.8;

                if (newProgress >= 1) {
                    const jumpDistance = 50;
                    const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);
                    const jumpDirection = distanceFromOrigin >= maxDistance - 10 ? -1 : 1;

                    setCurrentPosition(prev => {
                        const newX = prev[0] + (jumpDistance * jumpDirection);
                        const clampedX = Math.max(
                            position[0] - maxDistance,
                            Math.min(position[0] + maxDistance, newX)
                        );

                        return [clampedX, prev[1], prev[2]];
                    });

                    setIsJumping(false);
                    setNextJumpTime(Math.random() * 3 + 1);
                    timeRef.current = 0;
                    return 0;
                }

                return newProgress;
            });

            const jumpHeight = 20 * jumpProgress * (1 - jumpProgress) * 6;
            const jumpDistance = 25;
            const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);
            const jumpDirection = distanceFromOrigin >= maxDistance - 10 ? -1 : 1;
            const forwardDistance = jumpProgress * jumpDistance * jumpDirection;

            if (groupRef.current) {
                groupRef.current!.position.set(
                    currentPosition[0] + forwardDistance,
                    currentPosition[1] + jumpHeight,
                    currentPosition[2]
                );

                groupRef.current!.rotation.x = (jumpProgress - 0.5) * -0.8 * jumpDirection;
                groupRef.current!.rotation.z = Math.sin(jumpProgress * Math.PI) * 0.2;
            }

        } else {
            if (groupRef.current) {
                groupRef.current!.position.lerp(new THREE.Vector3(currentPosition[0], currentPosition[1], currentPosition[2]), 0.1);
                groupRef.current!.rotation.x = THREE.MathUtils.lerp(groupRef.current!.rotation.x, 0, 0.1);
                groupRef.current!.rotation.z = THREE.MathUtils.lerp(groupRef.current!.rotation.z, 0, 0.1);
                groupRef.current!.position.y = currentPosition[1] + Math.sin(timeRef.current * 2) * 0.5;
            }
        }
    });

    if (!gltf?.scene) {
        return (
            <group
                ref={groupRef}
                position={position}
                scale={scale}
                onClick={handleClick}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                <mesh>
                    <boxGeometry args={[2, 0.3, 3]}/>
                    <meshStandardMaterial
                        color="#8feba4"
                        emissive={isHovered ? "#4a9960" : "#000000"}
                        emissiveIntensity={isHovered ? 0.3 : 0}
                    />
                </mesh>
            </group>
        );
    }

    return (
        <group
            ref={groupRef}
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <primitive
                object={gltf.scene.clone()}
                position={[0, 0, 0]}
                scale={[scale, scale, scale]}
            />

            {isHovered && (
                <>
                    <pointLight
                        intensity={2}
                        color={isDay ? "#ffdd00" : "#00ffff"}
                        distance={30}
                    />
                    {(groupRef.current?.position.y || 0) > clickableMinY && (
                        <pointLight
                            intensity={4}
                            color="#00ff00"
                            distance={50}
                        />
                    )}
                </>
            )}
        </group>
    );
}

export default Dolphin;