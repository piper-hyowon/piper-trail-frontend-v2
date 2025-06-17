import React, {Suspense, useRef, useState, useMemo, useEffect} from 'react';
import {Canvas} from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    PerspectiveCamera,
} from '@react-three/drei';
import {EffectComposer, Bloom} from '@react-three/postprocessing';
import {useTheme} from '../../context/ThemeContext';
import {
    islands,
    createDefaultIsland,
    IslandConfig,
} from '../../config/island.config';
import CameraControls from '../three/CameraControls.tsx'
import ResourceIsland from "./ResourceIsland.tsx";
import Dolphin from "./object/Dolphin.tsx";
import {CanvasLoadingScreen} from "./LoadingScreen.tsx";
import {Sea} from "./Sea.tsx";
import {SkyScene} from "./SkyScene.tsx";
import * as THREE from 'three';
import {useEasterEgg} from "../../context/EasterEggDolphinContext.tsx";

interface ThreeJsVisualizationProps {
    categories: string[];
    onIslandClick: (category: string) => void;
}

const CAMERA_CONFIG = {
    position: [150, 24, 154] as [number, number, number],
    fov: 75,
};

const ORBIT_CONTROLS_CONFIG = {
    dampingFactor: 0.07,
    maxPolarAngle: Math.PI / 2,
    minPolarAngle: Math.PI / 6,
    minDistance: 1,
    maxDistance: 290,
    enablePan: false,
};

const BLOOM_CONFIG = {
    mipmapBlur: true,
    intensity: 1.0,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.95,
    resolutionScale: 0.5,
};

const SceneContent: React.FC<{
    isDay: boolean;
    categories: string[];
    onIslandClick: (category: string) => void;
    orbitControlsRef: React.RefObject<any>;
}> = ({isDay, categories, onIslandClick}) => {

    const envPreset = useMemo(() => (isDay ? 'sunset' : 'night'), [isDay]);

    const finalIslands: IslandConfig[] = useMemo(() => {
        return categories.map((category) => {
            const predefinedIsland = islands.find(
                island => island.name.toLowerCase() === category.toLowerCase()
            );

            if (predefinedIsland) {
                return predefinedIsland;
            } else {
                return createDefaultIsland(category, Math.random());
            }
        });
    }, [categories]);

    const {setEasterEggUnlocked} = useEasterEgg();

    const handleDolphinClick = () => {
        setEasterEggUnlocked(true);

        // 상태 업데이트 후 navigate
        setTimeout(() => {
            window.location.href = '/dolphin'
        }, 100);
    };

    return (
        <>
            <SkyScene isDay={isDay}/>
            <Environment
                preset={envPreset}
                background={false}
                resolution={64}
            />
            <PerspectiveCamera
                makeDefault
                position={CAMERA_CONFIG.position}
                fov={CAMERA_CONFIG.fov}
            />

            <ambientLight intensity={isDay ? 0.6 : 0.3}/>
            <directionalLight
                position={[10, 10, 5]}
                intensity={isDay ? 1 : 0.5}
                color={isDay ? "#ffffff" : "#4169E1"}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            <Sea/>
            <Dolphin position={[-60, -15, -100]} scale={0.08} isDay={isDay}
                     onClick={handleDolphinClick}/>

            {finalIslands.map((island) => (
                <ResourceIsland
                    key={island.path}
                    resource={island}
                    isDay={isDay}
                    onIslandClick={onIslandClick}
                />
            ))}

            <EffectComposer enabled={typeof window !== 'undefined' && window.innerWidth > 768}>
                <Bloom
                    mipmapBlur={BLOOM_CONFIG.mipmapBlur}
                    intensity={BLOOM_CONFIG.intensity}
                    luminanceThreshold={BLOOM_CONFIG.luminanceThreshold}
                    luminanceSmoothing={BLOOM_CONFIG.luminanceSmoothing}
                    resolutionScale={BLOOM_CONFIG.resolutionScale}
                />
            </EffectComposer>
        </>
    );
};

const ThreeJsVisualization: React.FC<ThreeJsVisualizationProps> = ({
                                                                       categories,
                                                                       onIslandClick
                                                                   }) => {
    const {themeMode} = useTheme();
    const isDay = themeMode === 'light';

    const [isLoading, setIsLoading] = useState(true);
    const orbitControlsRef = useRef<any>(null);
    const isMobile = useMemo(
        () => typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        []
    );

    const handleCameraMove = (direction: string) => {
        if (!orbitControlsRef.current) return;

        const controls = orbitControlsRef.current;
        const camera = controls.object;
        const moveDistance = 10;
        const seaLimit = 100;

        // 카메라의 현재 방향 벡터
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; // Y축 제거 (수평 이동만)
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        let movement = new THREE.Vector3();

        switch (direction) {
            case 'up':
                movement = forward.clone().multiplyScalar(-moveDistance);
                break;
            case 'down':
                movement = forward.clone().multiplyScalar(moveDistance);
                break;
            case 'left':
                movement = right.clone().multiplyScalar(-moveDistance);
                break;
            case 'right':
                movement = right.clone().multiplyScalar(moveDistance);
                break;
            case 'reset':
                camera.position.set(...CAMERA_CONFIG.position);
                controls.target.set(0, 0, 0);
                controls.update();
                return;
        }

        const newTarget = controls.target.clone().add(movement);

        // 경계 체크
        newTarget.x = Math.max(-seaLimit, Math.min(seaLimit, newTarget.x));
        newTarget.z = Math.max(-seaLimit, Math.min(seaLimit, newTarget.z));

        controls.target.copy(newTarget);
        controls.update();
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <Canvas
                dpr={isMobile ? 1 : [1, 1.5]}
                gl={{
                    powerPreference: 'high-performance',
                    antialias: true,
                    alpha: false,
                }}
                shadows
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                }}
            >
                <Suspense fallback={<CanvasLoadingScreen/>}>
                    <SceneContent
                        isDay={isDay}
                        categories={categories}
                        onIslandClick={onIslandClick}
                        orbitControlsRef={orbitControlsRef}
                    />
                    <OrbitControls
                        ref={orbitControlsRef}
                        enableDamping
                        dampingFactor={ORBIT_CONTROLS_CONFIG.dampingFactor}
                        maxPolarAngle={ORBIT_CONTROLS_CONFIG.maxPolarAngle}
                        minPolarAngle={ORBIT_CONTROLS_CONFIG.minPolarAngle}
                        minDistance={ORBIT_CONTROLS_CONFIG.minDistance}
                        maxDistance={ORBIT_CONTROLS_CONFIG.maxDistance}
                        enablePan={ORBIT_CONTROLS_CONFIG.enablePan}
                    />
                </Suspense>
            </Canvas>
            <CameraControls
                onMove={handleCameraMove}
                isDay={isDay}
            />
        </div>
    );
};

export default ThreeJsVisualization;