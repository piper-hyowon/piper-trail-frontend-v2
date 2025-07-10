import React from 'react';
import styled, {keyframes} from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';

// 물고기 애니메이션
const swimFish1 = keyframes`
  0% {
    transform: translateX(-100px) translateY(0) scaleX(-1);
  }
  50% {
    transform: translateX(calc(100vw + 100px)) translateY(-10px) scaleX(-1);
  }
  50.01% {
    transform: translateX(calc(100vw + 100px)) translateY(-10px) scaleX(1);
  }
  100% {
    transform: translateX(-100px) translateY(0) scaleX(1);
  }
`;

const swimFish2 = keyframes`
  0% {
    transform: translateX(calc(100vw + 50px)) translateY(0) scaleX(1);
  }
  50% {
    transform: translateX(-50px) translateY(15px) scaleX(1);
  }
  50.01% {
    transform: translateX(-50px) translateY(15px) scaleX(-1);
  }
  100% {
    transform: translateX(calc(100vw + 50px)) translateY(0) scaleX(-1);
  }
`;

const swimFish3 = keyframes`
  0% {
    transform: translateX(-80px) translateY(0) scaleX(-1) rotate(-5deg);
  }
  25% {
    transform: translateX(25vw) translateY(-20px) scaleX(-1) rotate(-5deg);
  }
  50% {
    transform: translateX(50vw) translateY(10px) scaleX(-1) rotate(-5deg);
  }
  75% {
    transform: translateX(75vw) translateY(-15px) scaleX(-1) rotate(-5deg);
  }
  100% {
    transform: translateX(calc(100vw + 80px)) translateY(0) scaleX(-1) rotate(-5deg);
  }
`;

// 거품 애니메이션
const bubbleFloat = keyframes`
  0% {
    transform: translateY(100px) translateX(0) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) translateX(20px) scale(1.2);
    opacity: 0;
  }
`;

// 해초 애니메이션
const seaweedWave = keyframes`
  0%, 100% {
    transform: rotate(-3deg) translateX(0);
  }
  50% {
    transform: rotate(3deg) translateX(5px);
  }
`;

// 물결 애니메이션
const waveMotion = keyframes`
  0%, 100% {
    transform: translateY(0) scaleY(1);
  }
  50% {
    transform: translateY(-3px) scaleY(1.05);
  }
`;

const FooterContainer = styled.footer`
  padding: 4px ${({theme}) => theme.spacing.xs};
  background: ${({theme}) =>
          theme.colors.background === '#121212'
                  ? 'linear-gradient(to bottom, rgba(21, 68, 89, 0.95), rgba(32, 106, 122, 0.98))'
                  : 'linear-gradient(to bottom, rgba(64, 224, 208, 0.15), rgba(0, 206, 209, 0.25))'
  };
  position: relative;
  z-index: 1;
  overflow: hidden;
  min-height: 50px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({theme}) =>
            theme.colors.background === '#121212'
                    ? 'linear-gradient(180deg, transparent 0%, rgba(64, 224, 208, 0.05) 50%, rgba(0, 206, 209, 0.1) 100%)'
                    : 'linear-gradient(180deg, transparent 0%, rgba(126, 206, 213, 0.1) 50%, rgba(64, 224, 208, 0.2) 100%)'
    };
    animation: ${waveMotion} 4s ease-in-out infinite;
  }
`;

const WaveTop = styled.div`
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 20px;
  background: ${({theme}) =>
          theme.colors.background === '#121212'
                  ? 'rgba(64, 224, 208, 0.2)'
                  : 'rgba(64, 224, 208, 0.3)'
  };
  filter: blur(8px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: repeating-linear-gradient(90deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px);
    animation: ${waveMotion} 3s linear infinite;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const FooterNav = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 4px;
  position: relative;
`;

// 투명한 텍스트 버튼
const IslandButton = styled.div<{ $active: boolean }>`
  position: relative;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({theme, $active}) =>
          $active
                  ? theme.colors.background === '#121212'
                          ? '#40E0D0'
                          : '#00B5A3'
                  : theme.colors.background === '#121212'
                          ? 'rgba(255, 255, 255, 0.8)'
                          : 'rgba(30, 30, 30, 0.7)'
  };
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({$active}) => $active ? '80%' : '0'};
    height: 2px;
    background: ${({theme}) =>
            theme.colors.background === '#121212'
                    ? 'linear-gradient(90deg, transparent, #40E0D0, transparent)'
                    : 'linear-gradient(90deg, transparent, #00B5A3, transparent)'
    };
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-2px);
    color: ${({theme}) =>
            theme.colors.background === '#121212'
                    ? '#40E0D0'
                    : '#00B5A3'
    };
    text-shadow: ${({theme}) =>
            theme.colors.background === '#121212'
                    ? '0 0 15px rgba(64, 224, 208, 0.5)'
                    : '0 0 15px rgba(0, 181, 163, 0.3)'
    };

    &::after {
      width: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: ${({theme}) => theme.fontSizes.xsmall};

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const LinkIcon = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 14px;
  transition: all 0.3s;
  opacity: ${({$active}) => $active ? 1 : 0.7};
  filter: ${({$active}) =>
          $active
                  ? 'drop-shadow(0 0 5px currentColor)'
                  : 'none'
  };

  ${IslandButton}:hover & {
    transform: scale(1.2);
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 13px;
  }
`;

const LinkLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

// 물고기 컴포넌트
const Fish = styled.div<{ $type: number }>`
  position: absolute;
  font-size: ${({$type}) => $type === 1 ? '16px' : $type === 2 ? '14px' : '18px'};
  animation: ${({$type}) =>
          $type === 1 ? swimFish1 : $type === 2 ? swimFish2 : swimFish3
  } ${({$type}) =>
          $type === 1 ? '20s' : $type === 2 ? '25s' : '30s'
  } linear infinite;
  animation-delay: ${({$type}) => $type * 2}s;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  top: ${({$type}) => $type === 1 ? '15%' : $type === 2 ? '50%' : '30%'};
`;

// 거품 컴포넌트
const Bubble = styled.div<{ $delay: number; $size: number; $left: number }>`
  position: absolute;
  width: ${({$size}) => $size * 0.7}px;
  height: ${({$size}) => $size * 0.7}px;
  background: ${({theme}) =>
          theme.colors.background === '#121212'
                  ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))'
                  : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))'
  };
  border-radius: 50%;
  left: ${({$left}) => $left}%;
  bottom: -10px;
  animation: ${bubbleFloat} ${({$size}) => 4 + $size / 10}s ease-in-out infinite;
  animation-delay: ${({$delay}) => $delay}s;
  z-index: 1;
`;

// 해초 컴포넌트
const Seaweed = styled.div<{ $height: number; $left: number }>`
  position: absolute;
  bottom: 0;
  left: ${({$left}) => $left}%;
  width: 2px;
  height: ${({$height}) => $height * 0.6}px;
  background: ${({theme}) =>
          theme.colors.background === '#121212'
                  ? 'linear-gradient(to top, #2E8B57, #3CB371)'
                  : 'linear-gradient(to top, #228B22, #32CD32)'
  };
  border-radius: 50% 50% 0 0;
  transform-origin: bottom;
  animation: ${seaweedWave} ${({$height}) => 3 + $height / 30}s ease-in-out infinite;
  animation-delay: ${({$left}) => $left / 20}s;
  opacity: 0.6;
  z-index: 0;
`;

const FooterLinks: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const links = [
        {path: '/', label: 'Home', icon: '🏠'},
        {path: '/tech', label: 'Tech', icon: '💻'},
        {path: '/food', label: 'Food', icon: '🍽️'},
        {path: '/about', label: 'About', icon: '👤'},
        {path: '/projects', label: 'Projects', icon: '🚀'},
        {path: '/postcards', label: 'Postcards', icon: '💌'},
    ];

    return (
        <FooterContainer>
            <WaveTop/>

            {/* 해초들 */}
            <Seaweed $height={30} $left={5}/>
            <Seaweed $height={40} $left={15}/>
            <Seaweed $height={35} $left={85}/>
            <Seaweed $height={45} $left={95}/>

            {/* 물고기들 */}
            <Fish $type={1}>🐟</Fish>
            <Fish $type={2}>🐠</Fish>
            <Fish $type={3}>🐡</Fish>

            {/* 거품들 */}
            <Bubble $delay={0} $size={6} $left={10}/>
            <Bubble $delay={1} $size={8} $left={25}/>
            <Bubble $delay={2} $size={5} $left={40}/>
            <Bubble $delay={1.5} $size={7} $left={60}/>
            <Bubble $delay={0.5} $size={6} $left={75}/>
            <Bubble $delay={2.5} $size={9} $left={90}/>

            <FooterContent>
                <FooterNav>
                    {links.map(link => (
                        <IslandButton
                            key={link.path}
                            $active={path === link.path}
                            onClick={() => navigate(link.path)}
                        >
                            <LinkIcon $active={path === link.path}>
                                {link.icon}
                            </LinkIcon>
                            <LinkLabel>
                                {link.label}
                            </LinkLabel>
                        </IslandButton>
                    ))}
                </FooterNav>
            </FooterContent>
        </FooterContainer>
    );
};

export default FooterLinks;