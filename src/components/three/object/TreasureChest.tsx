
import {useFrame} from '@react-three/fiber'
import React, {useRef, useMemo} from 'react'
import * as THREE from 'three'

type Props = {
    position: [number, number, number]
    scale: number
    isDay: boolean
}

const TreasureChest: React.FC<Props> = ({position, scale, isDay}) => {
    const lidRef = useRef<THREE.Group>(null!)
    const lockRef = useRef<THREE.Mesh>(null!)
    const eyesRef = useRef<THREE.Group>(null!)
    const gemsRef = useRef<THREE.Group>(null!)
    const coinsRef = useRef<THREE.Group>(null!)
    const keyRef = useRef<THREE.Mesh>(null!)
    const hingesRef = useRef<THREE.Group>(null!)

    // 보석 데이터 생성 (더 다양하고 많은 보석들)
    const gemData = useMemo(() => {
        const gems = []
        const gemColors = [
            '#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff',
            '#ff4080', '#80ff40', '#4080ff', '#ff8040', '#8040ff',
            '#40ff80', '#ff4040', '#40ff40', '#4040ff', '#ffff40'
        ]

        for (let i = 0; i < 30; i++) {
            gems.push({
                position: [
                    (Math.random() - 0.5) * 1.2,
                    0.05 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 0.8
                ] as [number, number, number],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ] as [number, number, number],
                color: gemColors[Math.floor(Math.random() * gemColors.length)],
                size: 0.08 + Math.random() * 0.1,
                blinkOffset: Math.random() * Math.PI * 2,
                blinkSpeed: 0.8 + Math.random() * 1.2,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.8
            })
        }
        return gems
    }, [])

    // 금화 데이터 생성
    const coinData = useMemo(() => {
        const coins = []
        for (let i = 0; i < 15; i++) {
            coins.push({
                position: [
                    (Math.random() - 0.5) * 1.2,
                    0.02 + Math.random() * 0.15,
                    (Math.random() - 0.5) * 0.9
                ] as [number, number, number],
                rotation: [Math.PI / 2 + (Math.random() - 0.5) * 0.3, 0, Math.random() * Math.PI * 2] as [number, number, number],
                spinOffset: Math.random() * Math.PI * 2
            })
        }
        return coins
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime

        // 뚜껑 열림/닫힘 - 더 자연스러운 애니메이션
        const targetAngle = isDay ? -Math.PI * 0.65 : -Math.PI * 0.1 // 더 많이 열림
        if (lidRef.current) {
            const currentAngle = lidRef.current.rotation.x
            const diff = targetAngle - currentAngle
            lidRef.current.rotation.x += diff * 0.06 // 더 부드러운 이징
        }

        // 자물쇠 애니메이션 - 밤에는 잠김, 낮에는 열림
        if (lockRef.current) {
            if (!isDay) {
                lockRef.current.rotation.z = Math.sin(t * 3) * 0.15
                lockRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05)
            } else {
                lockRef.current.rotation.z += (0 - lockRef.current.rotation.z) * 0.1
                lockRef.current.scale.setScalar(1)
            }
        }

        // 열쇠 애니메이션 (낮에만 보임)
        if (keyRef.current && isDay) {
            keyRef.current.rotation.z = Math.sin(t * 2) * 0.1
            keyRef.current.position.y = 0.8 + Math.sin(t * 1.5) * 0.05
        }

        // 경첩 애니메이션
        if (hingesRef.current) {
            hingesRef.current.children.forEach((hinge, index) => {
                const mesh = hinge as THREE.Mesh
                mesh.rotation.y = Math.sin(t * 2 + index) * 0.1
            })
        }

        // 눈 깜빡임
        if (isDay && eyesRef.current) {
            const blink = Math.sin(t * 4)
            eyesRef.current.scale.y = blink > 0.95 ? 0.1 : 1
        }

        // 보석 애니메이션 - 회전, 떠오름, 반짝임
        if (gemsRef.current) {
            gemsRef.current.children.forEach((gem, index) => {
                const gemInfo = gemData[index]
                if (gemInfo) {
                    // 회전
                    gem.rotation.x += 0.02 + (index * 0.001)
                    gem.rotation.y += 0.025 + (index * 0.002)
                    gem.rotation.z += 0.015 + (index * 0.001)

                    // 떠오름 효과
                    const floatY = Math.sin(t * gemInfo.floatSpeed + gemInfo.floatOffset) * 0.03
                    gem.position.y = gemInfo.position[1] + floatY

                    // 반짝임 효과 (material 업데이트)
                    const material = (gem as THREE.Mesh).material as THREE.MeshStandardMaterial
                    if (material && !isDay) {
                        const intensity = 0.3 + Math.sin(t * gemInfo.blinkSpeed + gemInfo.blinkOffset) * 0.4
                        material.emissiveIntensity = intensity
                    } else if (material && isDay) {
                        material.emissiveIntensity = 0.4 + Math.sin(t * 2 + index) * 0.2
                    }
                }
            })
        }

        // 금화 애니메이션 - 스핀
        if (coinsRef.current) {
            coinsRef.current.children.forEach((coin, index) => {
                const coinInfo = coinData[index]
                if (coinInfo) {
                    coin.rotation.z = t * 1.5 + coinInfo.spinOffset
                    // 약간의 떠오름
                    const floatY = Math.sin(t * 0.8 + index) * 0.01
                    coin.position.y = coinInfo.position[1] + floatY
                }
            })
        }
    })

    return (
        <group position={position} scale={scale}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.7, 1.1]}/>
                <meshStandardMaterial
                    color="#8B4513"
                    roughness={0.6}
                    metalness={0.1}
                    normalScale={new THREE.Vector2(0.5, 0.5)}
                />
            </mesh>

            {/* 본체 하단 받침 */}
            <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.7, 0.1, 1.2]}/>
                <meshStandardMaterial color="#654321" roughness={0.7} metalness={0.05}/>
            </mesh>

            {/* 뚜껑 그룹 - 경첩 중심 */}
            <group ref={lidRef} position={[0, 0.35, -0.5]}>
                <mesh position={[0, 0.2, 0.5]} castShadow>
                    <boxGeometry args={[1.65, 0.5, 1.15]}/>
                    <meshStandardMaterial
                        color="#A0522D"
                        roughness={0.5}
                        metalness={0.15}
                    />
                </mesh>

                {/* 뚜껑 손잡이 */}
                <mesh position={[0, 0.45, 0.9]} castShadow>
                    <sphereGeometry args={[0.08, 12, 12]}/>
                    <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1}/>
                </mesh>
            </group>

            {/* 경첩들 */}
            <group ref={hingesRef}>
                <mesh position={[-0.7, 0.35, -0.5]} castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.4, 8]}/>
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2}/>
                </mesh>
                <mesh position={[0.7, 0.35, -0.5]} castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.4, 8]}/>
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2}/>
                </mesh>
            </group>

            {/* 금속 테두리들 */}
            <mesh position={[0, 0.35, 0.56]} castShadow>
                <boxGeometry args={[1.4, 0.08, 0.08]}/>
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1}/>
            </mesh>
            <mesh position={[0, -0.1, 0.56]} castShadow>
                <boxGeometry args={[1.4, 0.08, 0.08]}/>
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1}/>
            </mesh>
            <mesh position={[-0.76, 0.125, 0.56]} castShadow>
                <boxGeometry args={[0.08, 0.5, 0.08]}/>
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1}/>
            </mesh>
            <mesh position={[0.76, 0.125, 0.56]} castShadow>
                <boxGeometry args={[0.08, 0.5, 0.08]}/>
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1}/>
            </mesh>

            {/* 자물쇠 */}
            <mesh ref={lockRef} position={[0, 0.1, 0.62]} castShadow>
                <group>
                    {/* 자물쇠 몸체 */}
                    <mesh>
                        <boxGeometry args={[0.15, 0.1, 0.08]}/>
                        <meshStandardMaterial
                            color="#FFD700"
                            metalness={1}
                            roughness={0.2}
                            emissive={!isDay ? '#FFD700' : '#000'}
                            emissiveIntensity={!isDay ? 0.3 : 0.5}
                        />
                    </mesh>
                    {/* 자물쇠 고리 */}
                    <mesh position={[0, 0.08, 0]}>
                        <torusGeometry args={[0.07, 0.02, 8, 16]}/>
                        <meshStandardMaterial
                            color="#FFD700"
                            metalness={1}
                            roughness={0.2}
                            emissive={!isDay ? '#FFD700' : '#000'}
                            emissiveIntensity={!isDay ? 0.3 : 0.5}
                        />
                    </mesh>
                </group>
            </mesh>

            {/* 열쇠 (낮에만 보임) */}
            {isDay && (
                <mesh ref={keyRef} position={[0.3, 0.8, 0.7]} castShadow>
                    <group>
                        {/* 열쇠 몸체 */}
                        <mesh>
                            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]}/>
                            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3}/>
                        </mesh>
                        {/* 열쇠 머리 */}
                        <mesh position={[0, 0.12, 0]}>
                            <torusGeometry args={[0.04, 0.015, 6, 12]}/>
                            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3}/>
                        </mesh>
                        {/* 열쇠 날 */}
                        <mesh position={[0.02, -0.08, 0]}>
                            <boxGeometry args={[0.03, 0.04, 0.01]}/>
                            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3}/>
                        </mesh>
                    </group>
                </mesh>
            )}

            {/* 귀여운 눈 */}
            <group ref={eyesRef}>
                {/* 왼쪽 눈 */}
                <group position={[-0.35, 0.3, 0.57]}>
                    <mesh>
                        <sphereGeometry args={[0.1, 16, 16]}/>
                        <meshStandardMaterial color="white"/>
                    </mesh>
                    <mesh position={[0.02, 0, 0.08]}>
                        <sphereGeometry args={[0.07, 12, 12]}/>
                        <meshStandardMaterial color="black"/>
                    </mesh>
                    <mesh position={[0.01, 0.02, 0.09]}>
                        <sphereGeometry args={[0.02, 8, 8]}/>
                        <meshStandardMaterial
                            color="white"
                            emissive="white"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                </group>

                {/* 오른쪽 눈 */}
                <group position={[0.35, 0.3, 0.57]}>
                    <mesh>
                        <sphereGeometry args={[0.1, 16, 16]}/>
                        <meshStandardMaterial color="white"/>
                    </mesh>
                    <mesh position={[-0.02, 0, 0.08]}>
                        <sphereGeometry args={[0.07, 12, 12]}/>
                        <meshStandardMaterial color="black"/>
                    </mesh>
                    <mesh position={[-0.01, 0.02, 0.09]}>
                        <sphereGeometry args={[0.02, 8, 8]}/>
                        <meshStandardMaterial
                            color="white"
                            emissive="white"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>
            </group>


            <group ref={gemsRef} position={[0, 0.15, 0]}>
                {gemData.map((gem, index) => (
                    <mesh
                        key={`gem-${index}`}
                        position={gem.position}
                        rotation={gem.rotation}
                        castShadow
                    >
                        <octahedronGeometry args={[gem.size]}/>
                        <meshStandardMaterial
                            color={gem.color}
                            metalness={0.7}
                            roughness={0.1}
                            emissive={gem.color}
                            emissiveIntensity={4}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                ))}
            </group>

            {/* 금화들 (낮에만 보임) */}
            {isDay && (
                <group ref={coinsRef} position={[0, 0.05, 0]}>
                    {coinData.map((coin, index) => (
                        <mesh
                            key={`coin-${index}`}
                            position={coin.position}
                            rotation={coin.rotation}
                            castShadow
                        >
                            <cylinderGeometry args={[0.09, 0.09, 0.02, 16]}/>
                            <meshStandardMaterial
                                color="#FFD700"
                                metalness={1}
                                roughness={0.1}
                                emissive="#FFAA00"
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    ))}
                </group>
            )}

            {/* 마법 반짝임 파티클 효과 (밤에만) */}
            {!isDay && (
                <group>
                    {[...Array(20)].map((_, i) => {
                        const x = (Math.random() - 0.5) * 3
                        const y = 0.5 + Math.random() * 1
                        const z = (Math.random() - 0.5) * 3
                        return (
                            <mesh key={`sparkle-${i}`} position={[x, y, z]}>
                                <sphereGeometry args={[0.01, 4, 4]}/>
                                <meshStandardMaterial
                                    color="#FFFFFF"
                                    emissive="#FFFFFF"
                                    emissiveIntensity={0.8 + Math.sin(Date.now() * 0.01 + i) * 0.5}
                                    transparent
                                    opacity={0.8}
                                />
                            </mesh>
                        )
                    })}
                </group>
            )}
        </group>
    )
}

export default TreasureChest