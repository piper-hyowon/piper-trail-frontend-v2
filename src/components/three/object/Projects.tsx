import {useLoader} from '@react-three/fiber'
import React, {useRef} from 'react'
import * as THREE from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'

interface TextItem {
    text: string
    position: [number, number, number]
    size: number
    height: number
    fallbackSize?: [number, number, number]
}

const Text3D: React.FC<{
    item: TextItem
    font: any
    fontError: boolean
    isDay: boolean
    isTitle?: boolean
}> = ({item, font, fontError, isDay, isTitle = false}) => {
    const {text, position, size, height, fallbackSize = [0.8, 0.1, 0.05]} = item

    const getColors = () => {
        if (isTitle) {
            return {
                color: isDay ? '#4a90e2' : '#64b5f6',
                emissive: isDay ? '#4a90e2' : '#64b5f6',
                emissiveIntensity: isDay ? 0.1 : 0.8,
                metalness: 0.2,
                roughness: 0.3
            }
        } else {
            return {
                color: isDay ? '#666666' : '#f8f2e3',
                emissive: isDay ? '#666666' : '#f8f2e3',
                emissiveIntensity: isDay ? 0.1 : 0.7
            }
        }
    }

    const colors = getColors()

    if (font && !fontError) {
        return (
            <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
                <primitive
                    object={
                        new TextGeometry(text, {
                            font,
                            size,
                            height,
                        })
                    }
                    attach="geometry"
                />
                <meshStandardMaterial {...colors} />
            </mesh>
        )
    } else {
        return (
            <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
                <boxGeometry args={fallbackSize}/>
                <meshStandardMaterial
                    color={colors.color}
                    emissive={colors.emissive}
                    emissiveIntensity={colors.emissiveIntensity}
                />
            </mesh>
        )
    }
}

const Projects: React.FC<{
    position: [number, number, number]
    scale: number
    isDay: boolean
}> = ({position, scale, isDay}) => {
    const groupRef = useRef<THREE.Group>(null!)

    let font: any = null
    let fontError = false

    try {
        font = useLoader(FontLoader as any, '/fonts/Goseogu_Regular.json')
    } catch (error) {
        fontError = true
        console.warn('Font not found, using simple geometry')
    }

    const titleText: TextItem = {
        text: 'Projects',
        position: [-1.4, -0.5, -1.4],
        size: 0.6,
        height: 0.04,
        fallbackSize: [2.5, 0.3, 0.1]
    }

    const projectTexts: TextItem[] = [
        {
            text: '더즐 Duzzle',
            position: [-1.6, -0.45, -0.3],
            size: 0.5,
            height: 0.03
        },
        {
            text: 'dBtree 디비트리',
            position: [-1, -0.5, 0.6],
            size: 0.4,
            height: 0.03
        },
        {
            text: 'Piper Trail',
            position: [-1.3, -0.5, 1.5],
            size: 0.4,
            height: 0.03
        }
    ]

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <Text3D
                item={titleText}
                font={font}
                fontError={fontError}
                isDay={isDay}
                isTitle={true}
            />

            {projectTexts.map((item, index) => (
                <Text3D
                    key={index}
                    item={item}
                    font={font}
                    fontError={fontError}
                    isDay={isDay}
                    isTitle={false}
                />
            ))}
        </group>
    )
}

export default Projects