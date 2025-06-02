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
                                             clickableMinY = 5,
                                         }) => {
    const gltf = useGLTF('/models/dolphin.gltf');
    const groupRef = useRef<THREE.Group | null>(null);
    const [isJumping, setIsJumping] = useState(false);
    const [jumpProgress, setJumpProgress] = useState(0);
    const [nextJumpTime, setNextJumpTime] = useState(Math.random() * 3 + 1); // 1-4초 랜덤
    const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([...position]);
    const [isHovered, setIsHovered] = useState(false);
    const timeRef = useRef(0);
    const lastClickTime = useRef(0);
    const {setEasterEggUnlocked} = useEasterEgg();

    // 클릭 영역 제한용
    const handleClick = async (event: any) => {
        event.stopPropagation(); // OrbitControls와의 충돌 방지

        if (onClick) {
            const clickPoint = event.point;
            const dolphinCenter = groupRef.current?.position || new THREE.Vector3(currentPosition[0], currentPosition[1], currentPosition[2]);

            // 돌고래 중심으로부터의 거리 계산
            const distance = clickPoint.distanceTo(dolphinCenter);
            const clickableRadius = 12; // 클릭 가능한 반경을 작게 제한

            // 클릭 영역 내부이고 Y 좌표 조건도 만족할 때만 실행
            if (distance <= clickableRadius && clickPoint.y >= clickableMinY) {
                setEasterEggUnlocked(true);
                localStorage.setItem('dolphinAccess', 'true');

                setTimeout(() => {
                    onClick();
                }, 100);
            }
        }
    };

    const handlePointerEnter = (event: any) => {
        // event.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerLeave = (event: any) => {
        event.stopPropagation();
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
            // 현재 위치~원래 위치 거리
            const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);

            // 최대 거리에 도달했으면 점프 방향을 뒤로 (원래 위치로)
            const shouldJumpBackward = distanceFromOrigin >= maxDistance;

            // 점프 시작
            setIsJumping(true);
            setJumpProgress(0);
            timeRef.current = 0;
        }

        if (isJumping) {
            setJumpProgress(prev => {
                const newProgress = prev + delta * 0.9; // 점프 속도 조절 (숫자가 클수록 빠름)

                if (newProgress >= 1) {
                    // 점프 완료 - 방향 결정해서 새로운 위치로 업데이트
                    const jumpDistance = 50; // 점프로 이동할 거리
                    const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);

                    // 최대 거리 근처면 뒤로, 아니면 앞으로
                    const jumpDirection = distanceFromOrigin >= maxDistance - 10 ? -1 : 1;

                    setCurrentPosition(prev => {
                        const newX = prev[0] + (jumpDistance * jumpDirection);
                        // 최대 거리를 벗어나지 않도록 제한
                        const clampedX = Math.max(
                            position[0] - maxDistance,
                            Math.min(position[0] + maxDistance, newX)
                        );

                        return [clampedX, prev[1], prev[2]];
                    });

                    setIsJumping(false);
                    setNextJumpTime(Math.random() * 3 + 1); // 다음 점프까지 1-4초 랜덤
                    timeRef.current = 0;
                    return 0;
                }

                return newProgress;
            });

            // 포물선 계산 (y = -4x² + 4x, x는 0-1 범위)
            const jumpHeight = 20 * jumpProgress * (1 - jumpProgress) * 6; // 높이 조절
            const jumpDistance = 25;
            const distanceFromOrigin = Math.abs(currentPosition[0] - position[0]);

            // 점프 방향 결정
            const jumpDirection = distanceFromOrigin >= maxDistance - 10 ? -1 : 1;
            const forwardDistance = jumpProgress * jumpDistance * jumpDirection;

            // 돌고래 위치 업데이트
            if (groupRef.current) {
                groupRef.current!.position.set(
                    currentPosition[0] + forwardDistance,
                    currentPosition[1] + jumpHeight,
                    currentPosition[2]
                );

                // 점프 중 회전 (방향에 따라 회전도 조정)
                groupRef.current!.rotation.x = (jumpProgress - 0.5) * -0.8 * jumpDirection;
                groupRef.current!.rotation.z = Math.sin(jumpProgress * Math.PI) * 0.2;
            }

        } else {
            // 현재 위치 유지하면서 떠다니는 움직임만
            if (groupRef.current) {
                groupRef.current!.position.lerp(new THREE.Vector3(currentPosition[0], currentPosition[1], currentPosition[2]), 0.1);

                groupRef.current!.rotation.x = THREE.MathUtils.lerp(groupRef.current!.rotation.x, 0, 0.1);
                groupRef.current!.rotation.z = THREE.MathUtils.lerp(groupRef.current!.rotation.z, 0, 0.1);

                // 기본 상태에서 약간의 떠다니는 움직임
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
                {/* 폴백 컴포넌트 */}
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
        </group>
    );
}

export default Dolphin