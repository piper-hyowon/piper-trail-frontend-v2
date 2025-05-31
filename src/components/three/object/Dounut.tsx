import {useFrame} from '@react-three/fiber'
import React, {useRef, useMemo} from 'react'
import * as THREE from 'three'

const Donut: React.FC<{ position: [number, number, number], scale: number, isDay: boolean }> = ({
                                                                                                    position,
                                                                                                    scale,
                                                                                                    isDay
                                                                                                }) => {
    const donutRef = useRef<THREE.Group>(null!)
    const eyesRef = useRef<THREE.Group>(null!)
    const bubbleRef = useRef<THREE.Mesh>(null!)

    // 스프링클 데이터 생성
    const sprinkles = useMemo(() => {
        const sprinkleData = []
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff', '#ff00ff']

        for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2
            const radius = 0.6 + Math.random() * 0.6 // 도넛 반지름 주변
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius + 0.1 // y축이 도넛의 원형 평면
            const z = (Math.random() - 0.5) * 0.8// 도넛 두께 범위 내

            sprinkleData.push({
                position: [x, y, z] as [number, number, number],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ] as [number, number, number],
                color: colors[Math.floor(Math.random() * colors.length)],
                // 야간 깜빡임용 랜덤 오프셋
                blinkOffset: Math.random() * Math.PI * 2,
                blinkSpeed: 0.5 + Math.random() * 1.5
            })
        }

        return sprinkleData
    }, [])

    useFrame((state) => {
        // 야간모드에서만 잠자는 애니메이션
        if (!isDay) {
            // 코 물방울 애니메이션
            if (bubbleRef.current) {
                const bubbleTime = state.clock.elapsedTime * 2
                bubbleRef.current.position.y = 0.05 + Math.sin(bubbleTime) * 0.02
                bubbleRef.current.scale.setScalar(0.8 + Math.sin(bubbleTime * 1.5) * 0.2)
            }
        } else {
            if (eyesRef.current) {
                const blinkTime = Math.sin(state.clock.elapsedTime * 4)
                if (blinkTime > 0.95) {
                    eyesRef.current.scale.y = 0.1
                } else {
                    eyesRef.current.scale.y = 1
                }
            }
        }
    })

    return (
        <group ref={donutRef} position={position} scale={scale}>
            <group rotation={[Math.PI / 2, 0, 0]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    {/* 도넛 베이스  */}
                    <mesh>
                        <torusGeometry args={[0.8, 0.35, 16, 64]}/>
                        <meshStandardMaterial
                            color="#ffd700"
                            roughness={0.2}
                            metalness={0.1}
                            emissive={'#ffd700'}
                            emissiveIntensity={isDay ? 0.2 : 0.4}
                        />
                    </mesh>

                    {/* 핑크 글레이즈  */}
                    <mesh position={[0, 0.1, 0]}>
                        <torusGeometry args={[0.82, 0.32, 16, 64]}/>
                        <meshStandardMaterial
                            color="#ff69b4"
                            roughness={0.1}
                            metalness={0.3}
                            transparent
                            opacity={0.9}
                            emissive={'#ff69b4'}
                            emissiveIntensity={isDay ? 0.2 : 0.4}
                        />
                    </mesh>
                </group>
            </group>

            {/* 무지개 스프링클들 */}
            {sprinkles.map((sprinkle, index) => {
                // 야간 모드에서 깜빡임 효과
                const emissiveIntensity = !isDay ?
                    (Math.sin(Date.now() * 0.001 * sprinkle.blinkSpeed + sprinkle.blinkOffset) + 1) * 0.5 :
                    0

                return (
                    <mesh
                        key={index}
                        position={sprinkle.position}
                        rotation={sprinkle.rotation}
                    >
                        <cylinderGeometry args={[0.025, 0.025, 0.15, 6]}/>
                        <meshStandardMaterial
                            color={sprinkle.color}
                            roughness={0.3}
                            metalness={0.1}
                            emissive={!isDay ? sprinkle.color : '#000000'}
                            emissiveIntensity={emissiveIntensity}
                        />
                    </mesh>
                )
            })}

            {/* 표면에 더 가까운 스프링클들 */}
            {sprinkles.slice(0, 20).map((sprinkle, index) => {
                const emissiveIntensity = !isDay ?
                    (Math.sin(Date.now() * 0.001 * sprinkle.blinkSpeed + sprinkle.blinkOffset) + 1) * 0.4 :
                    0

                return (
                    <mesh
                        key={`surface-${index}`}
                        position={[sprinkle.position[0] * 0.9, sprinkle.position[1] * 0.9, sprinkle.position[2] + 0.25]}
                        rotation={sprinkle.rotation}
                    >
                        <cylinderGeometry args={[0.02, 0.02, 0.12, 6]}/>
                        <meshStandardMaterial
                            color={sprinkle.color}
                            roughness={0.3}
                            metalness={0.1}
                            emissive={!isDay ? sprinkle.color : '#000000'}
                            emissiveIntensity={emissiveIntensity}
                        />
                    </mesh>
                )
            })}

            {isDay ? (
                <group ref={eyesRef}>
                    {/* 왼쪽 눈 */}
                    <group position={[-0.25, 0.1, 0.6]}>
                        <mesh>
                            <sphereGeometry args={[0.12, 16, 16]}/>
                            <meshStandardMaterial color="white"/>
                        </mesh>
                        <mesh position={[0.02, 0, 0.08]}>
                            <sphereGeometry args={[0.08, 16, 16]}/>
                            <meshStandardMaterial color="black"/>
                        </mesh>
                        <mesh position={[0.01, 0.03, 0.11]}>
                            <sphereGeometry args={[0.03, 8, 8]}/>
                            <meshStandardMaterial
                                color="white"
                                emissive="white"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                    </group>

                    {/* 오른쪽 눈 */}
                    <group position={[0.25, 0.1, 0.6]}>
                        <mesh>
                            <sphereGeometry args={[0.12, 16, 16]}/>
                            <meshStandardMaterial color="white"/>
                        </mesh>
                        <mesh position={[-0.02, 0, 0.08]}>
                            <sphereGeometry args={[0.08, 16, 16]}/>
                            <meshStandardMaterial color="black"/>
                        </mesh>
                        <mesh position={[-0.01, 0.03, 0.11]}>
                            <sphereGeometry args={[0.03, 8, 8]}/>
                            <meshStandardMaterial
                                color="white"
                                emissive="white"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                    </group>
                </group>
            ) : (
                /* 야간 - 잠자는 눈 */
                <group>
                    {/* 왼쪽 잠자는 눈 (작은 곡선) */}
                    <mesh position={[-0.25, 0.1, 0.6]} rotation={[0, 0, 1.5]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]}/>
                        <meshStandardMaterial
                            color="black"
                            emissive="#333333"
                            emissiveIntensity={0.2}
                        />
                    </mesh>

                    {/* 오른쪽 잠자는 눈 */}
                    <mesh position={[0.25, 0.1, 0.6]} rotation={[0, 0, -1.5]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]}/>
                        <meshStandardMaterial
                            color="black"
                            emissive="#333333"
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                </group>
            )}

            {/* 코 물방울 - 야간에만 표시 */}
            {!isDay && (
                <mesh ref={bubbleRef} position={[0.15, 0.05, 0.9]}>
                    <sphereGeometry args={[0.2, 12, 12]}/>
                    <meshStandardMaterial
                        color="#87CEEB"
                        transparent
                        opacity={0.7}
                        emissive="#87CEEB"
                        emissiveIntensity={0.6}
                        roughness={0.1}
                        metalness={0.1}
                    />
                </mesh>
            )}

            {/* 귀여운 입 (하트 모양) */}
            <mesh position={[0, -0.1, 0.65]} rotation={[0, 0, Math.PI]}>
                <sphereGeometry args={[0.04, 16, 16, 0, Math.PI]}/>
                <meshStandardMaterial color="#ff1493"/>
            </mesh>

            {/* 볼 홍조 */}
            <mesh position={[-0.45, 0, 0.5]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]}/>
                <meshStandardMaterial
                    color="#ffb6c1"
                    transparent
                    opacity={0.6}
                    emissive="#ffb6c1"
                    emissiveIntensity={!isDay ? 0.8 : 0.3}
                />
            </mesh>
            <mesh position={[0.45, 0, 0.5]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]}/>
                <meshStandardMaterial
                    color="#ffb6c1"
                    transparent
                    opacity={0.6}
                    emissive="#ffb6c1"
                    emissiveIntensity={!isDay ? 0.8 : 0.3}
                />
            </mesh>

        </group>
    )
}

export default Donut