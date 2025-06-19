import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {Card, CardTitle} from '../components/ui/Card';
import {useApi} from "../context/ApiContext";
import ThreeJsVisualization, {CAMERA_CONFIG} from "../components/three/ThreeJsVisualization.tsx";
import CameraControls from '../components/three/CameraControls.tsx';
import {ALL_CATEGORIES, ALL_CATEGORY_NAMES} from "../config/navigation.config";
import * as THREE from 'three';
import {useTheme} from '../context/ThemeContext';

const HomeContainer = styled.div<{ $is3DView: boolean }>`
  padding: ${({$is3DView}) => $is3DView ? '0' : '20px'};
  height: ${({$is3DView}) => $is3DView ? 'calc(100vh - 180px)' : 'auto'};
  position: relative;

  @media (max-width: 768px) {
    height: ${({$is3DView}) => $is3DView ? 'calc(100vh - 220px)' : 'auto'};
    padding: ${({$is3DView}) => $is3DView ? '0' : '12px'};
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CategoryCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryDescription = styled.p`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 16px;
  opacity: 0.8;
  line-height: 1.6;
`;

const ApiLinkText = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: ${({theme}) => theme.colors.secondary};
  margin-top: 8px;
  font-size: 14px;
`;

const ThreeJsWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const HomePage: React.FC = () => {
    const {acceptHeader, navigateTo, setAcceptHeader} = useApi();
    const {themeMode} = useTheme();
    const is3DView = acceptHeader === 'text/html';
    const isDay = themeMode === 'light';
    const orbitControlsRef = useRef<any>(null);

    useEffect(() => {
        setAcceptHeader('text/html');
    }, [setAcceptHeader]);

    useEffect(() => {
        // 3D 뷰일 때 body 스크롤 방지
        if (is3DView) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('three-view-active');
        } else {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('three-view-active');
        }

        // cleanup
        return () => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('three-view-active');
        };
    }, [is3DView]);

    const handleCategoryClick = (category: string) => {
        navigateTo(`/${category}`);
    };

    const handleCameraMove = (direction: string) => {
        if (!orbitControlsRef.current) return;

        const controls = orbitControlsRef.current;
        const camera = controls.object;
        const moveDistance = 10;
        const seaLimit = 100;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
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

        newTarget.x = Math.max(-seaLimit, Math.min(seaLimit, newTarget.x));
        newTarget.z = Math.max(-seaLimit, Math.min(seaLimit, newTarget.z));

        controls.target.copy(newTarget);
        controls.update();
    };

    return (
        <HomeContainer $is3DView={is3DView}>
            {is3DView ? (
                <>
                    <ThreeJsWrapper>
                        <ThreeJsVisualization
                            categories={ALL_CATEGORY_NAMES.filter(e => e !== 'home')}
                            onIslandClick={handleCategoryClick}
                            orbitControlsRef={orbitControlsRef}
                        />
                    </ThreeJsWrapper>
                    <CameraControls
                        onMove={handleCameraMove}
                        isDay={isDay}
                    />
                </>
            ) : (
                <CategoriesGrid>
                    {ALL_CATEGORIES.filter(category => category.name !== 'home').map((category) => (
                        <CategoryCard
                            key={category.name}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <CardTitle>{category.icon} {category.name}</CardTitle>
                            <CategoryDescription>{category.description}</CategoryDescription>
                            <ApiLinkText>/{category.name}</ApiLinkText>
                        </CategoryCard>
                    ))}
                </CategoriesGrid>
            )}
        </HomeContainer>
    );
};

export default HomePage;