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
import ResourceIsland from "./ResourceIsland.tsx";
import Dolphin from "./object/Dolphin.tsx";
import {CanvasLoadingScreen} from "./LoadingScreen.tsx";
import {Sea} from "./Sea.tsx";
import {SkyScene} from "./SkyScene.tsx";
import {useEasterEgg} from "../../context/EasterEggDolphinContext.tsx";

interface ThreeJsVisualizationProps {
    categories: string[];
    onIslandClick: (category: string) => void;
    onCameraMove?: (direction: string) => void;
    orbitControlsRef?: React.MutableRefObject<any>;
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
                                                                       onIslandClick,
                                                                       orbitControlsRef: externalRef
                                                                   }) => {
    const {themeMode} = useTheme();
    const isDay = themeMode === 'light';

    const [isLoading, setIsLoading] = useState(true);
    const internalRef = useRef<any>(null);
    const orbitControlsRef = externalRef || internalRef;

    const isMobile = useMemo(
        () => typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        []
    );

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Canvas
            dpr={isMobile ? 1 : [1, 1.5]}
            gl={{
                powerPreference: 'high-performance',
                antialias: true,
                alpha: false,
            }}
            shadows
            style={{
                width: '100%',
                height: '100%',
                display: 'block'
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
    );
};

// Export camera config for external use
export {CAMERA_CONFIG};
export default ThreeJsVisualization;