import React, {useMemo, useRef, useEffect} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import {theme} from "../../styles/theme.ts";
import {GradientTexture, Stars} from "@react-three/drei";
import * as THREE from "three";

const STARS_CONFIG = {
    radius: 50,
    depth: 100,
    count: 3000,
    factor: 5,
    saturation: 1,
    speed: 1,
} as const;

export const SkyScene: React.FC<{ isDay: boolean }> = ({isDay}) => {
    const {themeMode} = useTheme();
    const starsRef = useRef<THREE.Group | null>(null);

    const skyColors = useMemo(() => {
        const currentTheme = theme[themeMode];
        return currentTheme.skyColors;
    }, [themeMode]);

    useEffect(() => {
        if (starsRef.current && !isDay) {
            const timer = setTimeout(() => {
                starsRef.current?.traverse((child) => {
                    if (child instanceof THREE.Points && child.geometry) {
                        const positions = child.geometry.attributes.position;
                        const colors = child.geometry.attributes.color;
                        const sizes = child.geometry.attributes.size;

                        if (positions) {
                            const posArray = positions.array;
                            const colorArray = colors?.array;
                            const sizeArray = sizes?.array;

                            const newPositions = [];
                            const newColors = [];
                            const newSizes = [];

                            // y >= 0인 별들만 유지하면서 모든 attribute 보존
                            for (let i = 0; i < posArray.length; i += 3) {
                                const x = posArray[i];
                                const y = posArray[i + 1];
                                const z = posArray[i + 2];

                                if (y >= 0) {
                                    newPositions.push(x, y, z);

                                    // 색상 정보 보존
                                    if (colorArray) {
                                        newColors.push(
                                            colorArray[i],
                                            colorArray[i + 1],
                                            colorArray[i + 2]
                                        );
                                    }

                                    // 크기 정보 보존
                                    if (sizeArray) {
                                        newSizes.push(sizeArray[i / 3]);
                                    }
                                }
                            }

                            // 새로운 geometry 생성하면서 모든 attribute 복원
                            const newGeometry = new THREE.BufferGeometry();
                            newGeometry.setAttribute(
                                'position',
                                new THREE.Float32BufferAttribute(newPositions, 3)
                            );

                            if (newColors.length > 0) {
                                newGeometry.setAttribute(
                                    'color',
                                    new THREE.Float32BufferAttribute(newColors, 3)
                                );
                            }

                            if (newSizes.length > 0) {
                                newGeometry.setAttribute(
                                    'size',
                                    new THREE.Float32BufferAttribute(newSizes, 1)
                                );
                            }

                            child.geometry = newGeometry;

                            // Material 속성 복원
                            const material = child.material as THREE.PointsMaterial;
                            if (material) {
                                material.vertexColors = newColors.length > 0;
                                material.size = STARS_CONFIG.factor;
                                material.sizeAttenuation = false;
                                material.needsUpdate = true;
                            }
                        }
                    }
                });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isDay, starsRef.current]);

    return (
        <>
            <GradientTexture stops={[0, 0.3, 0.5]} colors={[...skyColors]} attach="background"/>
            {!isDay && (
                <group ref={starsRef}>
                    <Stars {...STARS_CONFIG} fade/>
                </group>
            )}
        </>
    );
};