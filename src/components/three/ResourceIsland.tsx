import React, {useRef, useState, useMemo, useCallback} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {Html} from '@react-three/drei';
import {
    Book,
    Mailbox,
    PalmTree,
    Donut,
    Projects,
    QuestionMark,
    ResourcePath, Lamppost
} from "./object";
import type {IslandConfig} from "../../config/island.config.ts";

interface ResourceIslandProps {
    resource: IslandConfig;
    isDay: boolean;
    onIslandClick: (category: string) => void;
}

const ObjectRenderer: React.FC<{
    object: any;
    isDay: boolean;
}> = React.memo(({object, isDay}) => {
    const {type, config} = object;

    // 개발 모드에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
        console.log('Rendering object:', type, config.position);
    }

    const commonProps = {
        position: config.position,
        scale: config.scale,
        isDay
    };

    switch (type) {
        case 'book':
            return <Book {...commonProps} />;
        case 'mailbox':
            return <Mailbox {...commonProps} />;
        case 'palmTree':
            return <PalmTree position={config.position} scale={config.scale}/>;
        case 'donut':
            return <Donut {...commonProps} />;
        case 'questionMark':
            return <QuestionMark {...commonProps} />;
        case 'projects':
            return <Projects {...commonProps} />;
        case 'lamppost':
            return <Lamppost {...commonProps} />;
        default:
            return null;
    }
});

const HoverTooltip: React.FC<{
    position: [number, number, number];
    isDay: boolean;
}> = React.memo(({position, isDay}) => (
    <Html position={position} center>
        <div style={{
            background: isDay ? 'rgba(255,255,255,0.49)' : 'rgba(0,0,0,0.57)',
            color: isDay ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: isDay ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(255,255,255,0.2)',
            border: isDay ? '1px solid #ddd' : '1px solid #555'
        }}>
            Double-click to navigate
        </div>
    </Html>
));

const IslandBase: React.FC<{
    isHovered: boolean;
}> = React.memo(({isHovered}) => (
    <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[30, 35, 7, 32]}/>
        <meshStandardMaterial
            color={isHovered ? "rgb(248,242,227)" : "#f3e5ab"}
            roughness={0.7}
        />
    </mesh>
));

const ResourceIsland: React.FC<ResourceIslandProps> = React.memo(({
                                                                      resource,
                                                                      isDay,
                                                                      onIslandClick
                                                                  }) => {
    const groupRef = useRef<THREE.Group>(new THREE.Group());
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handlePointerLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const handleDoubleClick = useCallback((e: any) => {
        e.stopPropagation();
        onIslandClick(resource.path.replace('/', ''));
    }, [onIslandClick, resource.path]);

    // 애니메이션 최적화
    const lastAnimationTime = useRef(0);
    const ANIMATION_THROTTLE = 16; // ~60fps

    useFrame(({clock}) => {
        const now = performance.now();
        if (now - lastAnimationTime.current < ANIMATION_THROTTLE) return;

        if (groupRef.current) {
            const elapsedTime = clock.getElapsedTime();
            groupRef.current.position.y = Math.sin(elapsedTime * 0.9) * 0.7 - 1.5;

            if (isHovered) {
                groupRef.current.rotation.y = elapsedTime * 5;
            } else {
                groupRef.current.rotation.y = 0;
            }
        }

        lastAnimationTime.current = now;
    });

    const renderedObjects = useMemo(() =>
        resource.objects.map((object, index) => (
            <group key={`${object.type}-${index}`}>
                <ObjectRenderer
                    object={object}
                    isDay={isDay}
                />
            </group>
        )), [resource.objects, isDay]
    );

    const resourcePathPosition = useMemo((): [number, number, number] => [
        resource.position[0],
        resource.position[1] + 20,
        resource.position[2]
    ], [resource.position]);

    const tooltipPosition = useMemo((): [number, number, number] => [
        resource.position[0],
        resource.position[1] + 35,
        resource.position[2]
    ], [resource.position]);

    return (
        <>
            <group
                ref={groupRef}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onDoubleClick={handleDoubleClick}
                position={resource.position}
            >
                <IslandBase isHovered={isHovered}/>
                {renderedObjects}
            </group>

            {isHovered && (
                <>
                    <group position={resourcePathPosition}>
                        <ResourcePath path={resource.path} method="GET"/>
                    </group>
                    <HoverTooltip position={tooltipPosition} isDay={isDay}/>
                </>
            )}
        </>
    );
});

export const useThrottledFrame = (callback: (state: any) => void, throttleMs: number = 16) => {
    const lastCallTime = useRef(0);

    useFrame((state) => {
        const now = performance.now();
        if (now - lastCallTime.current >= throttleMs) {
            callback(state);
            lastCallTime.current = now;
        }
    });
};

export default ResourceIsland;