// TODO: 미완. 수정 필요

import {useLoader, useFrame} from '@react-three/fiber'
import React, {useRef, useMemo} from 'react'
import * as THREE from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'

const Projects: React.FC<{
    position: [number, number, number],
    scale: number,
    isDay: boolean
}> = ({position, scale, isDay}) => {
    const groupRef = useRef<THREE.Group>(null!)
    const screenRef = useRef<THREE.Mesh>(null!)

    // 폰트 로드 (에러 처리 포함)
    let font = null;
    let fontError = false;

    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        font = useLoader(FontLoader as any, '/fonts/DXcutecute_Regular.json');
    } catch (error) {
        fontError = true;
        console.warn('Font not found, using simple geometry');
    }

    // Paper stack data
    const paperStack = useMemo(() => {
        const papers = []
        for (let i = 0; i < 12; i++) {
            papers.push({
                position: [
                    -1.5 + Math.random() * 0.2,
                    -0.5 + i * 0.015,
                    Math.random() * 0.15
                ] as [number, number, number],
                rotation: (Math.random() - 0.5) * 0.3,
                color: Math.random() > 0.7 ? '#ffffcc' : '#ffffff'
            })
        }
        return papers
    }, [])

    // Code lines for screen animation
    const codeLines = useMemo(() => {
        return Array.from({length: 8}, (_, i) => ({
            position: [-0.5, 0.25 - i * 0.08, 0.01] as [number, number, number],
            width: 0.3 + Math.random() * 0.4,
            delay: i * 0.1
        }))
    }, [])

    useFrame((state) => {
        // Screen flicker effect
        if (screenRef.current) {
            const flicker = Math.sin(state.clock.elapsedTime * 60) * 0.1 + 0.9
            screenRef.current.material.emissiveIntensity = (isDay ? 0.3 : 0.5) * flicker
        }
    })

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* PROJECTS 텍스트 */}
            {font && !fontError ? (
                <mesh position={[-2, 1.5, 0]}>
                    <primitive
                        object={
                            new TextGeometry('PROJECTS', {
                                font,
                                size: 0.4,
                                height: 0.1,
                            })
                        }
                        attach="geometry"
                    />
                    <meshStandardMaterial
                        color={isDay ? '#4a90e2' : '#64b5f6'}
                        emissive={isDay ? '#4a90e2' : '#64b5f6'}
                        emissiveIntensity={isDay ? 0.1 : 0.3}
                        metalness={0.2}
                        roughness={0.3}
                    />
                </mesh>
            ) : (
                <mesh position={[0, 1.5, 0]}>
                    <boxGeometry args={[2.5, 0.3, 0.1]}/>
                    <meshStandardMaterial
                        color={isDay ? '#4a90e2' : '#64b5f6'}
                        emissive={isDay ? '#4a90e2' : '#64b5f6'}
                        emissiveIntensity={isDay ? 0.1 : 0.3}
                    />
                </mesh>
            )}

            {/* Duzzle 텍스트 */}
            {font && !fontError ? (
                <mesh position={[-1.5, 0.5, 0]}>
                    <primitive
                        object={
                            new TextGeometry('Duzzle', {
                                font,
                                size: 0.15,
                                height: 0.05,
                            })
                        }
                        attach="geometry"
                    />
                    <meshStandardMaterial
                        color={isDay ? '#666666' : '#aaaaaa'}
                        emissive={isDay ? '#666666' : '#aaaaaa'}
                        emissiveIntensity={isDay ? 0.1 : 0.2}
                    />
                </mesh>
            ) : (
                <mesh position={[-1, 0.5, 0]}>
                    <boxGeometry args={[0.8, 0.1, 0.05]}/>
                    <meshStandardMaterial
                        color={isDay ? '#666666' : '#aaaaaa'}
                        emissive={isDay ? '#666666' : '#aaaaaa'}
                        emissiveIntensity={isDay ? 0.1 : 0.2}
                    />
                </mesh>
            )}

            {/* dBtree 텍스트 */}
            {font && !fontError ? (
                <mesh position={[0.7, 0.5, 0]}>
                    <primitive
                        object={
                            new TextGeometry('dBtree', {
                                font,
                                size: 0.15,
                                height: 0.05,
                            })
                        }
                        attach="geometry"
                    />
                    <meshStandardMaterial
                        color={isDay ? '#666666' : '#aaaaaa'}
                        emissive={isDay ? '#666666' : '#aaaaaa'}
                        emissiveIntensity={isDay ? 0.1 : 0.2}
                    />
                </mesh>
            ) : (
                <mesh position={[1, 0.5, 0]}>
                    <boxGeometry args={[0.8, 0.1, 0.05]}/>
                    <meshStandardMaterial
                        color={isDay ? '#666666' : '#aaaaaa'}
                        emissive={isDay ? '#666666' : '#aaaaaa'}
                        emissiveIntensity={isDay ? 0.1 : 0.2}
                    />
                </mesh>
            )}

            {/* Enhanced Paper stack with varied colors */}
            {paperStack.map((paper, index) => (
                <mesh
                    key={index}
                    position={paper.position}
                    rotation={[0, paper.rotation, 0]}
                >
                    <boxGeometry args={[1.2, 0.02, 0.8]}/>
                    <meshStandardMaterial
                        color={paper.color}
                        emissive={paper.color}
                        emissiveIntensity={isDay ? 0.1 : 0.2}
                    />
                </mesh>
            ))}

            {/* Laptop base with rounded edges */}
            <mesh position={[1.5, -0.4, 0]}>
                <boxGeometry args={[1.5, 0.1, 1]}/>
                <meshStandardMaterial
                    color={isDay ? '#2c2c2c' : '#404040'}
                    emissive={isDay ? '#2c2c2c' : '#404040'}
                    emissiveIntensity={isDay ? 0.1 : 0.2}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Laptop keyboard area */}
            <mesh position={[1.5, -0.35, 0.1]}>
                <boxGeometry args={[1.3, 0.02, 0.6]}/>
                <meshStandardMaterial
                    color={isDay ? '#1a1a1a' : '#2a2a2a'}
                />
            </mesh>

            {/* Laptop screen frame */}
            <mesh position={[1.5, 0.1, -0.4]} rotation={[-Math.PI / 3, 0, 0]}>
                <boxGeometry args={[1.4, 0.05, 0.9]}/>
                <meshStandardMaterial
                    color={isDay ? '#1a1a1a' : '#333333'}
                    emissive={isDay ? '#1a1a1a' : '#333333'}
                    emissiveIntensity={isDay ? 0.1 : 0.2}
                    metalness={0.7}
                    roughness={0.3}
                />
            </mesh>

            {/* Screen display with animated code lines */}
            <mesh ref={screenRef} position={[1.5, 0.1, -0.35]} rotation={[-Math.PI / 3, 0, 0]}>
                <planeGeometry args={[1.2, 0.7]}/>
                <meshStandardMaterial
                    color={isDay ? '#003d00' : '#00ff00'}
                    emissive={isDay ? '#003d00' : '#00ff00'}
                    emissiveIntensity={isDay ? 0.3 : 0.5}
                />
            </mesh>

            {/* Animated code lines on screen */}
            {codeLines.map((line, index) => (
                <mesh
                    key={index}
                    position={[1.5 + line.position[0], 0.1 + line.position[1], -0.34 + line.position[2]]}
                    rotation={[-Math.PI / 3, 0, 0]}
                >
                    <boxGeometry args={[line.width, 0.01, 0.02]}/>
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.8 + Math.sin(Date.now() * 0.005 + line.delay) * 0.2}
                    />
                </mesh>
            ))}

            {/* Coffee cup next to laptop */}
            <mesh position={[0.8, -0.2, 0.3]}>
                <cylinderGeometry args={[0.08, 0.06, 0.15, 12]}/>
                <meshStandardMaterial
                    color={isDay ? '#8B4513' : '#A0522D'}
                />
            </mesh>

            {/* Coffee steam */}
            <mesh position={[0.8, -0.05, 0.3]}>
                <sphereGeometry args={[0.02, 8, 8]}/>
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3 + Math.sin(Date.now() * 0.003) * 0.2}
                />
            </mesh>
        </group>
    )
}

export default Projects