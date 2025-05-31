import {useFrame, useLoader} from '@react-three/fiber'
import React, {useRef, useMemo} from 'react'
import * as THREE from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

const QuestionMark: React.FC<{
    position: [number, number, number],
    scale: number,
    isDay: boolean,
}> = ({position, scale, isDay}) => {
    const groupRef = useRef<THREE.Group>(null!)
    const materialRef = useRef<THREE.ShaderMaterial>(null!)

    // 폰트 로드 (에러 처리 포함)
    let font = null;
    let fontError = false;

    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        font = useLoader(FontLoader as any, '/fonts/The Jamsil 3 Regular_Regular.json');
    } catch (error) {
        fontError = true;
        console.warn('Font not found, using simple geometry');
    }

    // 네온 그라데이션 셰이더 머터리얼
    const neonMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                isDay: { value: isDay },
                color1: { value: new THREE.Color('#ff006e') }, // 핑크
                color2: { value: new THREE.Color('#8338ec') }, // 보라
                color3: { value: new THREE.Color('#3a86ff') }, // 파랑
                color4: { value: new THREE.Color('#06ffa5') }, // 청록
                color5: { value: new THREE.Color('#ffbe0b') }, // 노랑
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform bool isDay;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                uniform vec3 color5;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    // 시간에 따라 변화하는 그라데이션 위치
                    float wave1 = sin(time * 2.0 + vPosition.y * 0.5) * 0.5 + 0.5;
                    float wave2 = sin(time * 1.5 + vPosition.x * 0.3) * 0.5 + 0.5;
                    float wave3 = sin(time * 3.0 + vUv.y * 8.0) * 0.5 + 0.5;
                    
                    // 여러 색상을 혼합
                    vec3 color = mix(color1, color2, wave1);
                    color = mix(color, color3, wave2 * 0.7);
                    color = mix(color, color4, wave3 * 0.5);
                    color = mix(color, color5, sin(time * 4.0) * 0.3 + 0.3);
                    
                    // 네온 효과를 위한 밝기 조절
                    float brightness = isDay ? 1.3 : 1.5;
                    color *= brightness;
                    
                    // 펄스 효과
                    float pulse = sin(time * 6.0) * 0.2 + 0.8;
                    color *= pulse;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.DoubleSide,
        });
    }, [isDay]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.01
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
        }

        // 셰이더에 시간 전달
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
            materialRef.current.uniforms.isDay.value = isDay;
        }
    })

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {font && !fontError && (
                <>
                    {/* 메인 텍스트 */}
                    <mesh position={[-1.5, -2, 0]}>
                        <primitive
                            object={
                                new TextGeometry('?', {
                                    font,
                                    size: 3,
                                    height: 0.6,
                                    curveSegments: 12,
                                    bevelEnabled: true,
                                    bevelThickness: 0.1,
                                    bevelSize: 0.05,
                                })
                            }
                            attach="geometry"
                        />
                        <primitive object={neonMaterial} ref={materialRef} attach="material" />
                    </mesh>

                    {/* 글로우 효과 (뒤쪽) */}
                    <mesh position={[-1.5, -2, -0.2]} scale={1.1}>
                        <primitive
                            object={
                                new TextGeometry('?', {
                                    font,
                                    size: 3,
                                    height: 0.3,
                                })
                            }
                            attach="geometry"
                        />
                        <meshBasicMaterial
                            color={isDay ? '#ff4081' : '#ff006e'}
                            transparent
                            opacity={0.4}
                        />
                    </mesh>

                    {/* 외부 글로우 */}
                    <mesh position={[-1.5, -2, -0.4]} scale={1.2}>
                        <primitive
                            object={
                                new TextGeometry('?', {
                                    font,
                                    size: 3,
                                    height: 0.1,
                                })
                            }
                            attach="geometry"
                        />
                        <meshBasicMaterial
                            color={isDay ? '#ff6b35' : '#ffbe0b'}
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                </>
            )}

            {/* 주변 파티클 효과 */}
            {Array.from({length: 50}).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 0.8 + Math.sin(i * 0.5) * 0.3; // 훨씬 더 가깝게
                const height = Math.sin(i * 0.3) * 0.5; // 높이 변화도 줄임
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius+0.2 , // 물음표 중심에 맞춤
                            Math.sin(angle) * radius + height, // 물음표 높이에 맞춤
                            Math.sin(angle * 2) * 0.7 // z축 깊이 변화도 줄임
                        ]}
                    >
                        <sphereGeometry args={[0.03 + Math.random() * 0.05, 6, 6]} />
                        <meshBasicMaterial
                            color={
                                isDay
                                    ? (i % 3 === 0 ? '#ff006e' : i % 3 === 1 ? '#ffbe0b' : '#3a86ff')
                                    : (i % 3 === 0 ? '#ff006e' : i % 3 === 1 ? '#06ffa5' : '#8338ec')
                            }
                            transparent
                            opacity={0.7 + Math.sin(i * 0.8) * 0.2}
                        />
                    </mesh>
                );
            })}
        </group>
    )
}

export default QuestionMark