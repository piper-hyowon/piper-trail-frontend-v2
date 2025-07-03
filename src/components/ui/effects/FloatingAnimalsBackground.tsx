import React from 'react';
import styled, {keyframes} from 'styled-components';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-20px) rotate(3deg) scale(1.05);
  }
  50% {
    transform: translateY(-10px) rotate(-2deg) scale(1.02);
  }
  75% {
    transform: translateY(-15px) rotate(2deg) scale(1.03);
  }
`;

const swim = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  33% {
    transform: translateX(30px) translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateX(-20px) translateY(-5px) rotate(-3deg);
  }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const AnimalImage = styled.img<{
    $size: number;
    $top: number;
    $left: number;
    $delay: number;
    $animationType: 'float' | 'swim';
}>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  opacity: 0.85;
  animation: ${props => props.$animationType === 'swim' ? swim : float} ${props => props.$animationType === 'swim' ? '12s' : '10s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) brightness(1.01) contrast(1.3);
  transition: transform 0.3s ease;

  /* 다크모드에서 더 밝게 */
  @media (prefers-color-scheme: dark) {
    filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.1)) brightness(1.3) contrast(1.1);
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const animals: {
    src: string,
    size: number,
    top: number,
    left: number,
    delay: number,
    animationType: "float" | "swim"
} [] = [
    {src: "/images/turtle.png", size: 140, top: 15, left: 8, delay: 0, animationType: 'float' as const},
    {src: "/images/seal.png", size: 130, top: 25, left: 70, delay: 2, animationType: 'swim' as const},
    {src: "/images/octopus.png", size: 135, top: 60, left: 12, delay: 4, animationType: 'float' as const},
    {src: "/images/whale.png", size: 160, top: 65, left: 75, delay: 6, animationType: 'swim' as const},
    {src: "/images/turtle.png", size: 120, top: 45, left: 40, delay: 3, animationType: 'swim' as const},
    {src: "/images/octopus.png", size: 115, top: 10, left: 45, delay: 5, animationType: 'float' as const},
];

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center,
  transparent 0%,
  transparent 40%,
  ${({theme}) => `${theme.colors.postcard.creamBase}10`} 70%,
  ${({theme}) => `${theme.colors.postcard.creamBase}20`} 100%);
  pointer-events: none;
`;

const FloatingAnimalsBackground: React.FC = () => {
    return (
        <BackgroundContainer>
            {animals.map((animal, index) => (
                <AnimalImage
                    key={index}
                    src={animal.src}
                    alt=""
                    $size={animal.size}
                    $top={animal.top}
                    $left={animal.left}
                    $delay={animal.delay}
                    $animationType={animal.animationType}
                />
            ))}
            <GradientOverlay/>
        </BackgroundContainer>
    );
};

export default FloatingAnimalsBackground;