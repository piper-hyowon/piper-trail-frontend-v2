import React, { Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Sky,
  Stars,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import ThreeJSControlsGuide from "../components/three/ThreeJSControlsGuide";


// ────────────────────────────────────────────
// Loading Manager
// ────────────────────────────────────────────
function LoadingManager({ onLoaded }: { onLoaded: () => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => onLoaded(), 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoaded]);

  return null;
}

// ────────────────────────────────────────────
// Lights
// ────────────────────────────────────────────
function ChristmasLights({
  modelSize,
  modelCenter,
}: {
  modelSize: THREE.Vector3;
  modelCenter: [number, number, number];
}) {
  const starsRadius = Math.max(modelSize.x, modelSize.y, modelSize.z) * 0.8;
  const starPosition: [number, number, number] = [
    modelCenter[0],
    modelCenter[1] + 100,
    modelCenter[2],
  ];

  return (
    <>
      <group position={starPosition}>
        <Stars
          radius={starsRadius}
          depth={80}
          count={2000}
          factor={70}
          saturation={0}
          fade
          speed={0.9}
        />
        <Sky
          distance={450000}
          sunPosition={[0, -10, 0]}
          inclination={0}
          azimuth={180}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          rayleigh={0.5}
          turbidity={1}
        />
      </group>
      <ambientLight intensity={1.6} color="#d1e2f0" />
      <rectAreaLight
        position={[2.96308, 4.93927, 0.56404]}
        rotation={[
          (-87.678 * Math.PI) / 180,
          (-121.251 * Math.PI) / 180,
          (-88.015 * Math.PI) / 180,
        ]}
        intensity={2}
        color="#FFF5E1"
        width={8}
        height={8}
      />
      <pointLight
        position={[0, 2, 2]}
        intensity={0.5}
        color="#FFF5E1"
        distance={10}
      />
    </>
  );
}

function Lights({
  isNightMode,
  modelSize,
  modelCenter,
}: {
  isNightMode: boolean;
  modelSize: THREE.Vector3;
  modelCenter: [number, number, number];
}) {
  return isNightMode ? (
    <ChristmasLights modelSize={modelSize} modelCenter={modelCenter} />
  ) : (
    <>
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <ambientLight intensity={2} />
    </>
  );
}

// ────────────────────────────────────────────
// Model
// ────────────────────────────────────────────
const MODEL_URL = "/models/christmas-6.gltf";

function Model({ isNightMode }: { isNightMode: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([
    0, 50, 0,
  ]);
  const [cameraDistance, setCameraDistance] = useState<number>(500);
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const orig = child.material;
        const base = new THREE.MeshStandardMaterial({
          color: orig.color,
          map: orig.map,
          transparent: orig.transparent,
          opacity: orig.opacity,
          flatShading: true,
          roughness: 1,
          metalness: 0,
          envMapIntensity: 0,
        });
        child.material = base;

        if (isNightMode) {
          if (
            child.name.includes("창문불켜짐") ||
            child.name.includes("가로등")
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#ffffff",
              emissive: "#ffffe0",
              emissiveIntensity: 1,
              metalness: 0,
              roughness: 0.2,
            });
          } else if (child.name.includes("전구_주황")) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#fc7f50",
              emissive: "#fc7f50",
              emissiveIntensity: 1.3,
              metalness: 0,
              roughness: 0.2,
            });
          } else if (child.name.includes("전구_노랑")) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#ed9121",
              emissive: "#ed9121",
              emissiveIntensity: 1.3,
              metalness: 0,
              roughness: 0.2,
            });
          } else if (child.name.includes("전구_빨강")) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#d64045",
              emissive: "#d64045",
              emissiveIntensity: 1.3,
              metalness: 0.3,
              roughness: 0.2,
            });
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    setModelSize(size);

    const volume = size.x * size.y * size.z;
    const normalizedSize = Math.cbrt(volume);
    const aspectRatio = Math.max(
      size.x / size.y,
      size.y / size.z,
      size.x / size.z,
    );
    const aspectMultiplier = Math.max(1, Math.log10(aspectRatio) * 0.5);
    const optimalDistance = normalizedSize * 2 * aspectMultiplier;

    setModelCenter([center.x, center.y, center.z]);
    setCameraDistance(optimalDistance);
  }, [scene, isNightMode]);

  if (!modelSize) return null;

  return (
    <>
      <primitive object={scene} />
      <Lights
        isNightMode={isNightMode}
        modelSize={modelSize}
        modelCenter={modelCenter}
      />
      <PerspectiveCamera
        makeDefault
        position={[cameraDistance, cameraDistance, cameraDistance]}
        fov={40}
        near={1}
        far={cameraDistance * 4}
      />
      <OrbitControls
        target={modelCenter}
        maxPolarAngle={Math.PI / 2}
        minDistance={cameraDistance * 0.25}
        maxDistance={cameraDistance * 2.5}
        zoomSpeed={0.6}
        enableDamping
        dampingFactor={0.05}
        enableZoom
      />
    </>
  );
}

// ────────────────────────────────────────────
// DuzzleLibPage
// ────────────────────────────────────────────
const DuzzleLibPage: React.FC = () => {
  const isNightMode_default = true; // christmas 모델이므로 기본값 밤 모드
  const [isNightMode, setIsNightMode] = useState(isNightMode_default);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Wrapper>
      <ModeToggleButton
        isNightMode={isNightMode}
        onClick={() => setIsNightMode((prev) => !prev)}
      >
        {isNightMode ? "🌞 낮으로 전환" : "🌙 밤으로 전환"}
      </ModeToggleButton>

      <CanvasWrapper isNightMode={isNightMode}>
        {isLoading && <p>3D 모델 로딩 중...</p>}

        <Canvas
          gl={{
            preserveDrawingBuffer: true,
            toneMapping: isNightMode
              ? THREE.ACESFilmicToneMapping
              : THREE.NoToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.LinearDisplayP3ColorSpace,
          }}
        >
          {isNightMode && <color attach="background" args={["#090924"]} />}
          <PerspectiveCamera
            makeDefault
            position={[400, 400, 400]}
            fov={40}
            near={1}
            far={2000}
          />
          <LoadingManager onLoaded={() => setIsLoading(false)} />
          <Suspense fallback={null}>
            <Model isNightMode={isNightMode} />
          </Suspense>
        </Canvas>
        <ThreeJSControlsGuide isFullscreen={true} />
      </CanvasWrapper>
    </Wrapper>
  );
};

export default DuzzleLibPage;

// ────────────────────────────────────────────
// Styled Components
// ────────────────────────────────────────────
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// const CanvasWrapper = styled.div<{ isNightMode: boolean }>`
//   width: 100%;
//   height: 100%;
//   background-color: ${({ isNightMode }) =>
//     isNightMode ? "#090924" : "#f4f1e3"};
// `;

const CanvasWrapper = styled.div<{ isNightMode: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ isNightMode }) => (isNightMode ? "#090924" : "#f4f1e3")};

  canvas {
    outline: none;
    border: none;
    display: block; /* 인라인 요소 기본 여백 제거 */
  }
`;

const ModeToggleButton = styled.button<{ isNightMode: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  padding: 8px 16px;
  background-color: ${({ isNightMode }) =>
    isNightMode ? "#f4f1e3" : "#090924"};
  color: ${({ isNightMode }) => (isNightMode ? "#090924" : "#f4f1e3")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;


