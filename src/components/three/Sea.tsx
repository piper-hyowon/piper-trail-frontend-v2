import React, {useEffect, useMemo, useRef} from "react";

import {useTheme} from "../../context/ThemeContext.tsx";
import * as THREE from "three";
import {theme} from "../../styles/theme.ts";
import {useFrame} from "@react-three/fiber";
import {GradientTexture} from "@react-three/drei";

const WAVE_CONFIG = {
    frequency: 0.5,
    amplitude: 0.5,
    speed: 0.5,
} as const;

const MESH_CONFIG = {
    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    position: [0, -2, 0],
    planeArgs: [500, 500, 24, 24] as [number, number, number, number],
} as const;

const FPS_LIMIT = 30;

export const Sea: React.FC = React.memo(() => {
    const {themeMode, isDay} = useTheme();

    const seaColors = useMemo(() => {
        const currentTheme = theme[themeMode];
        return currentTheme.skyColors;
    }, [themeMode]);

    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    let lastUpdate = 0;

    const verticesCount = useMemo(() => {
        const [, , widthSegments, heightSegments] = MESH_CONFIG.planeArgs;
        return (widthSegments + 1) * (heightSegments + 1);
    }, []);

    const sharedBuffer = useMemo(() => {
        return {
            positions: new Float32Array(verticesCount * 3),
        };
    }, [verticesCount]);

    useEffect(() => {
        if (!meshRef.current) return;

        const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            sharedBuffer.positions[i * 3] = positions.getX(i);
            sharedBuffer.positions[i * 3 + 1] = positions.getY(i);
            sharedBuffer.positions[i * 3 + 2] = positions.getZ(i);
        }
    }, [sharedBuffer]);

    const updateWave = React.useCallback(
        (time: number) => {
            if (!meshRef.current) return;

            const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
            const positions = geometry.attributes.position;
            const freq = WAVE_CONFIG.frequency;
            const amp = WAVE_CONFIG.amplitude;

            for (let i = 0; i < positions.count; i++) {
                const x = sharedBuffer.positions[i * 3];
                const y = sharedBuffer.positions[i * 3 + 1];

                const phase = (x + y) * freq + time;
                const z = amp * (Math.sin(phase) + Math.cos(phase * 0.8));

                positions.setXYZ(i, x, y, z);
            }

            positions.needsUpdate = true;
        },
        [sharedBuffer]
    );

    const materialProps = useMemo(
        () => ({
            metalness: 0.1,
            roughness: 0.3,
            flatShading: true,
            transparent: true,
            opacity: 0.9,
            side: THREE.FrontSide,
            depthWrite: false,
        }),
        []
    );

    const colors = useMemo(() => {
        const currentTheme = theme[themeMode];
        return currentTheme.seaColors;
    }, [themeMode]);

    useFrame(({clock}) => {
        const now = performance.now();
        if (now - lastUpdate < 1000 / FPS_LIMIT) return;

        const time = clock.getElapsedTime() * WAVE_CONFIG.speed;
        updateWave(time);
        lastUpdate = now;
    });

    return (
        <mesh
            ref={meshRef}
            rotation={MESH_CONFIG.rotation}
            position={MESH_CONFIG.position as [number, number, number]}
        >
            <planeGeometry args={MESH_CONFIG.planeArgs}/>
            <meshStandardMaterial {...materialProps}>
                <GradientTexture stops={[0, 0.5, 1]} colors={colors} attach="map"/>
            </meshStandardMaterial>
            <mesh position={[0, 0, -30]}>
                <boxGeometry args={[MESH_CONFIG.planeArgs[[0]] + 10, MESH_CONFIG.planeArgs[1] + 10, 60]}/>
                <meshStandardMaterial
                    color={"#0ad2e8"}
                    transparent={true}
                    opacity={isDay ? 0.5 : 0.7}
                    depthWrite={false}
                />
            </mesh>
        </mesh>
    );
});
