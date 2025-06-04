import React, {useRef, useEffect, Suspense, useMemo, useState, useCallback} from 'react';
import {Canvas, extend, useFrame} from '@react-three/fiber';
import {useGLTF, PerspectiveCamera, OrbitControls, Text} from '@react-three/drei';
// import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {Font} from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';
import {CanvasLoadingScreen} from "../../three/LoadingScreen.tsx";

extend({
    AmbientLight: THREE.AmbientLight,
    DirectionalLight: THREE.DirectionalLight,
    PointLight: THREE.PointLight
});

interface Mailbox3DProps {
    hasEntries: boolean;
    onClick: () => void;
    width?: number;
    height?: number;
    entries?: any[];
}

const STAMP_COLORS: Record<string, string> = {
    'awesome': '#87CEEB',
    'interesting': '#DDA0DD',
    'helpful': '#90EE90',
    'inspiring': '#FFE4B5',
    'thank_you': '#FFDAB9',
    'love_it': '#FFB6C1'
};

const STAMP_NAMES: Record<string, string> = {
    'awesome': '멋져요',
    'interesting': '흥미로워요',
    'helpful': '도움돼요',
    'inspiring': '영감받았어요',
    'thank_you': '고마워요',
    'love_it': '사랑해요'
};

const getStampColor = (stampId: string): string => {
    return STAMP_COLORS[stampId] || '#cccccc';
};

const getStampName = (stampId: string): string => {
    return STAMP_NAMES[stampId] || '도장';
};

let fontCache: Font | null = null;
let fontLoadPromise: Promise<Font> | null = null;

const loadFont = (): Promise<Font> => {
    if (fontCache) return Promise.resolve(fontCache);
    if (fontLoadPromise) return fontLoadPromise;

    fontLoadPromise = new Promise((resolve, reject) => {
        const loader = new FontLoader();
        const fontPaths = [
            '/fonts/Ownglyph PDH Regular_Regular.json',
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
        ];

        const tryLoadFont = async (paths: string[]): Promise<void> => {
            for (const path of paths) {
                try {
                    const loadedFont = await new Promise<Font>((res, rej) => {
                        loader.load(path, res, undefined, rej);
                    });
                    fontCache = loadedFont;
                    resolve(loadedFont);
                    return;
                } catch (error) {
                    console.warn(`Font loading failed for ${path}:`, error);
                }
            }
            reject(new Error('All font loading attempts failed'));
        };

        tryLoadFont(fontPaths);
    });

    return fontLoadPromise;
};

const OptimizedText = React.memo(function OptimizedText({
                                                            text,
                                                            position,
                                                            size,
                                                            color,
                                                        }: any) {
    const [font, setFont] = useState<Font | null>(fontCache);
    const [fontError, setFontError] = useState(false);

    useEffect(() => {
        if (fontCache) {
            setFont(fontCache);
            return;
        }

        loadFont()
            .then(setFont)
            .catch(() => setFontError(true));
    }, []);

    const textGeometry = useMemo(() => {
        if (!font || fontError) return null;

        try {
            return new TextGeometry(text, {
                font: font,
                size: size,
                height: size * 0.02,
                curveSegments: 9,
                bevelEnabled: false
            });
        } catch (error) {
            console.error('TextGeometry creation failed:', error);
            return null;
        }
    }, [font, text, size, fontError]);

    if (fontError || !font || !textGeometry) {
        return (
            <Text
                position={position}
                fontSize={size}
                color={color}
                anchorX="left"
                anchorY="middle"
            >
                {text}
            </Text>
        );
    }

    return (
        <mesh position={position}>
            <primitive object={textGeometry}/>
            <meshStandardMaterial color={color}/>
        </mesh>
    );
});

const PostcardItem = React.memo(function PostcardItem({
                                                          entry,
                                                          index,
                                                          totalEntries
                                                      }: {
    entry: any;
    index: number;
    totalEntries: number;
}) {
    const groupRef = useRef<THREE.Group | null>(null);

    const position = useMemo(() => {
        const layer = Math.floor(index / 6);
        const posInLayer = index % 6;
        const radius = 2.5 + layer * 0.4;
        const height = 0.5 + layer * 0.6;
        const hourAngle = (posInLayer * 2) * (Math.PI / 6);

        return {
            x: Math.sin(hourAngle) * radius,
            y: height,
            z: Math.cos(hourAngle) * radius,
            rotation: hourAngle
        };
    }, [index]);

    const stampColor = useMemo(() => getStampColor(entry.stampId), [entry.stampId]);
    const stampName = useMemo(() => getStampName(entry.stampId), [entry.stampId]);

    const displayMessage = useMemo(() => {
        if (!entry.message) return null;
        return entry.message.length > 15
            ? entry.message.substring(0, 15) + '...'
            : entry.message;
    }, [entry.message]);

    useFrame(({clock}) => {
        if (groupRef.current) {
            const time = clock.getElapsedTime();
            const wingSpeed = 2 + index * 0.3;

            // 30fps
            if (Math.floor(time * 30) % 2 === 0) {
                const wingAngle = Math.sin(time * wingSpeed) * 0.2;
                groupRef.current!.rotation.z = wingAngle;
                groupRef.current!.position.y = position.y + Math.sin(time * wingSpeed + index) * 0.1;
            }
        }
    });

    return (
        <group
            ref={groupRef}
            position={[position.x, position.y, position.z]}
            rotation={[0, position.rotation, 0]}
        >
            {/* 엽서 몸통 */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.8, 0.6]}/>
                <meshStandardMaterial
                    color="#faf8f5"
                    side={2}
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>

            {/* 도장 */}
            <mesh position={[0.15, 0.15, 0.001]}>
                <circleGeometry args={[0.08]}/>
                <meshStandardMaterial
                    color={stampColor}
                    roughness={0.2}
                />
            </mesh>

            {/* 닉네임 텍스트 */}
            <OptimizedText
                text={entry.nickname}
                position={[-0.2, 0.1, 0.002]}
                size={0.09}
                color="#2c2c2c"
            />

            {/* 메시지 텍스트 */}
            {displayMessage && (
                <OptimizedText
                    text={displayMessage}
                    position={[-0.3, -0.05, 0.002]}
                    size={0.1}
                    color="#4a4a4a"
                />
            )}

            {/* 도장 이름 */}
            <OptimizedText
                text={stampName}
                position={[0.1, -0.05, 0.002]}
                size={0.05}
                color={stampColor}
            />

            {/* 날개들 */}
            <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, 0.5]}>
                <boxGeometry args={[0.3, 0.2, 0.01]}/>
                <meshStandardMaterial
                    color="white"
                    transparent
                    opacity={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh position={[0.5, 0.1, 0]} rotation={[0, 0, -0.5]}>
                <boxGeometry args={[0.3, 0.2, 0.01]}/>
                <meshStandardMaterial
                    color="white"
                    transparent
                    opacity={0.9}
                    roughness={0.1}
                />
            </mesh>
        </group>
    );
});

const MailboxModel = React.memo(function MailboxModel({hasEntries, entries = []}: any) {
    const groupRef = useRef<THREE.Group | null>(null);
    const gltf = useGLTF('/models/draco/mailbox.glb');

    useFrame(({clock}) => {
        if (groupRef.current) {
            const time = clock.getElapsedTime();
            // 15fps
            if (Math.floor(time * 15) % 2 === 0) {
                groupRef.current!.position.y = Math.sin(time * 0.5) * 0.1;
                groupRef.current!.rotation.y = time * 0.1;
            }
        }
    });

    const renderedPostcards = useMemo(() => {
        return entries.map((entry: any, index: number) => (
            <PostcardItem
                key={entry.id}
                entry={entry}
                index={index}
                totalEntries={entries.length}
            />
        ));
    }, [entries]);

    return (
        <group ref={groupRef} scale={hasEntries ? 1.1 : 1.0}>
            <primitive
                object={gltf.scene.clone()}
                scale={[1, 1, 1]}
                position={[1, -2, 0]}
                rotation={[Math.PI / 30, -Math.PI / 3, 0]}
            />

            {renderedPostcards}

            {hasEntries && (
                <pointLight
                    position={[0, 1, 2]}
                    color="#ffeb99"
                    intensity={1.5}
                    distance={8}
                />
            )}
        </group>
    );
});

const LoadingFallback = React.memo(function LoadingFallback() {
    return <CanvasLoadingScreen/>;
});

const MailboxScene = React.memo(function MailboxScene({hasEntries, entries}: any) {
    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[3, 2, 4]}
                fov={50}
            />

            <OrbitControls
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.1}
                enableZoom={true}
                // enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minDistance={2}
                maxDistance={10}
            />

            {/* 메인 조명  */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={3.5}
                color="#ffcccc"
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
            />

            {/* 보조 조명들 - 빨간색 계열로 */}
            <directionalLight
                position={[-5, 3, 3]}
                intensity={1.5}
                color="#ff9999"
            />

            <directionalLight
                position={[0, 3, -5]}
                intensity={1}
                color="#ffaaaa"
            />

            <directionalLight
                position={[0, -2, 5]}
                intensity={0.8}
                color="#ffdddd"
            />

            {/* 환경광 - 기본 밝기 */}
            <ambientLight intensity={0.8} color="#fff5f5"/>

            <MailboxModel hasEntries={hasEntries} entries={entries}/>
        </>
    );
});

function Mailbox3D({
                       hasEntries,
                       onClick,
                       width = 800,
                       height = 500,
                       entries = []
                   }: Mailbox3DProps) {

    const handleCanvasClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                margin: '0 auto',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
            onClick={handleCanvasClick}
        >
            <Canvas
                shadows
                dpr={[1, 1.2]}
                gl={{
                    powerPreference: 'high-performance',
                    antialias: false,
                    alpha: true,
                    stencil: false,
                    depth: true,
                    logarithmicDepthBuffer: false,
                    outputColorSpace: 'srgb',
                }}
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Suspense fallback={<LoadingFallback/>}>
                    <MailboxScene hasEntries={hasEntries} entries={entries}/>
                </Suspense>
            </Canvas>
        </div>
    );
}

export default React.memo(Mailbox3D);