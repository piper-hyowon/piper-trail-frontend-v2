import React, {useRef, useEffect, Suspense, useMemo, useState, useCallback} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {useGLTF, Environment, PerspectiveCamera, OrbitControls, Text} from '@react-three/drei';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {Font} from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';
import {CanvasLoadingScreen} from "../../three/LoadingScreen.tsx";

interface Mailbox3DProps {
    hasEntries: boolean;
    onClick: () => void;
    width?: number;
    height?: number;
    entries?: any[];
}

const getStampColor = (stampId: string): string => {
    const colors: Record<string, string> = {
        'awesome': '#87CEEB',
        'interesting': '#DDA0DD',
        'helpful': '#90EE90',
        'inspiring': '#FFE4B5',
        'thank_you': '#FFDAB9',
        'love_it': '#FFB6C1'
    };
    return colors[stampId] || '#cccccc';
};

const getStampName = (stampId: string): string => {
    const names: Record<string, string> = {
        'awesome': '멋져요',
        'interesting': '흥미로워요',
        'helpful': '도움돼요',
        'inspiring': '영감받았어요',
        'thank_you': '고마워요',
        'love_it': '사랑해요'
    };
    return names[stampId] || '도장';
};

function SafeText({text, position, size = 0.05, color = "#2c2c2c"}: any) {
    const [font, setFont] = useState<Font | null>(null);
    const [fontError, setFontError] = useState(false);

    useEffect(() => {
        const loader = new FontLoader();
        const fontPaths = [
            '/fonts/DXcutecute_Regular.json',
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
        ];

        const tryLoadFont = async (paths: string[]): Promise<void> => {
            for (const path of paths) {
                try {
                    const loadedFont = await new Promise<Font>((resolve, reject) => {
                        loader.load(path, resolve, undefined, reject);
                    });
                    setFont(loadedFont);
                    setFontError(false);
                    return;
                } catch (error) {
                    console.warn(`Font loading failed for ${path}:`, error);
                }
            }
            setFontError(true);
        };

        tryLoadFont(fontPaths);
    }, []);

    const textGeometry = useMemo(() => {
        if (!font || fontError) return null;

        try {
            return new TextGeometry(text, {
                font: font,
                size: size,
                height: size * 0.02,
                curveSegments: 12,
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
}

const MailboxModel = React.memo(function MailboxModel({hasEntries, entries = []}: any) {
    const groupRef = useRef<THREE.Group | null>(null);

    const gltf = useGLTF('/models/draco/mailbox.glb');

    useFrame(({clock}) => {
        if (groupRef.current) {
            groupRef.current!.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
            groupRef.current!.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });

    const postcardRefs = useRef<(THREE.Group | null)[]>([]);
    useFrame(({clock}) => {
        postcardRefs.current.forEach((ref, index) => {
            if (ref) {
                const time = clock.getElapsedTime();
                const wingSpeed = 2 + index * 0.3;
                const wingAngle = Math.sin(time * wingSpeed) * 0.2;
                ref.rotation.z = wingAngle;
                ref.position.y = Math.sin(time * wingSpeed + index) * 0.1;
            }
        });
    });

    return (
        <group ref={groupRef} scale={hasEntries ? 1.1 : 1.0}>
            <primitive
                object={gltf.scene.clone()}
                scale={[1, 1, 1]}
                position={[1, -2, 0]}
                rotation={[Math.PI / 30, -Math.PI / 3, 0]}
            />

            {/* 날아다니는 엽서들 - 시계방향 배치 */}
            {entries.map((entry: any, index: number) => {
                // 층별 설정 (6개씩 3층)
                const layer = Math.floor(index / 6);
                const posInLayer = index % 6;

                // 각 층의 반지름과 높이
                const radius = 2.5 + layer * 0.4;
                const height = 0.5 + layer * 0.6;

                // 시계방향 배치 (12시부터 시작해서 2시간씩)
                const hourAngle = (posInLayer * 2) * (Math.PI / 6);

                // 원형 좌표 계산
                const x = Math.sin(hourAngle) * radius;
                const z = Math.cos(hourAngle) * radius;

                return (
                    <group
                        key={entry.id}
                        ref={(el) => {
                            postcardRefs.current[index] = el;
                        }}
                        position={[x, height, z]}
                        rotation={[0, hourAngle, 0]}
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
                                color={getStampColor(entry.stampId)}
                                roughness={0.2}
                            />
                        </mesh>

                        {/* 닉네임 텍스트 */}
                        <SafeText
                            text={entry.nickname}
                            position={[-0.2, 0.1, 0.002]}
                            size={0.09}
                            color="#2c2c2c"
                        />

                        {/* 메시지 텍스트 */}
                        {entry.message && (
                            <SafeText
                                text={entry.message.length > 15
                                    ? entry.message.substring(0, 15) + '...'
                                    : entry.message}
                                position={[-0.3, -0.05, 0.002]}
                                size={0.06}
                                color="#4a4a4a"
                            />
                        )}

                        {/* 도장 이름 */}
                        <SafeText
                            text={getStampName(entry.stampId)}
                            position={[0.1, -0.05, 0.002]}
                            size={0.05}
                            color={getStampColor(entry.stampId)}
                        />

                        {/* 얇은 큐브 날개들 */}
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
            })}

            {/* 따뜻한 조명 */}
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

// 로딩 컴포넌트
function LoadingFallback() {
    return (
        <CanvasLoadingScreen/>
        // <mesh>
        //     <boxGeometry args={[1, 1, 1]}/>
        //     <meshBasicMaterial color="#7eb3d9"/>
        // </mesh>
    );
}

// 씬 설정
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
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minDistance={2}
                maxDistance={8}
            />

            <Environment
                preset="warehouse"
                background={false}
                resolution={64}
            />

            <directionalLight
                position={[10, 10, 5]}
                intensity={-4}
                color="#ffffff"
            />

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
                dpr={[1, 1.5]}
                gl={{
                    powerPreference: 'high-performance',
                    antialias: true,
                    alpha: true,
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

export default Mailbox3D;