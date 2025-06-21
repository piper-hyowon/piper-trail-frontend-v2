import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import styled, {keyframes} from 'styled-components';

interface Particle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    drift: number;
    rotation: number;
    color: string;
}

interface ConfettiEffectProps {
    show: boolean;
    message?: string;
    emoji?: string;
    particleCount?: number;
    duration?: number;
    colors?: string[];
    onComplete?: () => void;
}

const confettiFall = keyframes`
  0% {
    transform: translate(var(--x), -100px) rotate(var(--rotation));
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--x) + var(--drift)), calc(100vh + 100px)) rotate(calc(var(--rotation) + 360deg));
    opacity: 0;
  }
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20000;
  overflow: hidden;
`;

const ConfettiParticle = styled.div.attrs<{
    $delay: number;
    $duration: number;
    $drift: number;
    $x: number;
    $rotation: number;
    $color: string;
}>(props => ({
    style: {
        '--x': `${props.$x}px`,
        '--drift': `${props.$drift}px`,
        '--rotation': `${props.$rotation}deg`,
        animationDelay: `${props.$delay}s`,
        animationDuration: `${props.$duration}s`,
        background: props.$color,
    }
}))<{
    $delay: number;
    $duration: number;
    $drift: number;
    $x: number;
    $rotation: number;
    $color: string;
}>`
  position: absolute;
  width: 10px;
  height: 10px;
  animation: ${confettiFall} linear;
  animation-fill-mode: forwards;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    transform: rotate(45deg);
  }
`;

const SuccessMessage = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${({$show}) => $show ? 1 : 0.8});
  background: white;
  padding: ${({theme}) => theme.spacing.xl};
  border-radius: ${({theme}) => theme.borderRadius};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  opacity: ${({$show}) => $show ? 1 : 0};
  transition: all 0.3s ease;
  z-index: 15000;
  will-change: transform, opacity;
`;

const SuccessIcon = styled.div`
  font-size: 60px;
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const SuccessText = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin: 0;
  font-size: ${({theme}) => theme.fontSizes.xlarge};
`;

// components/effect/Confetti.tsx

const Confetti: React.FC<ConfettiEffectProps> = ({
                                                     show,
                                                     message,
                                                     emoji = '🎉',
                                                     particleCount = 150,
                                                     duration = 6000,
                                                     colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347'],
                                                     onComplete
                                                 }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [showMessage, setShowMessage] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const portalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (show && !isAnimating) {
            setIsAnimating(true);

            // 파티클 생성 (한 번만)
            const newParticles: Particle[] = [];
            const screenWidth = window.innerWidth;

            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * screenWidth,
                    delay: Math.random() * 0.5,
                    duration: 3 + Math.random() * 2,
                    drift: (Math.random() - 0.5) * 200,
                    rotation: Math.random() * 360,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }

            setParticles(newParticles);

            if (message) {
                setShowMessage(true);
            }

            // 정리 타이머
            cleanupTimeoutRef.current = setTimeout(() => {
                setParticles([]);
                setIsAnimating(false);

                if (message) {
                    messageTimeoutRef.current = setTimeout(() => {
                        setShowMessage(false);
                        if (onComplete) {
                            onComplete();
                        }
                    }, 3000);
                } else if (onComplete) {
                    onComplete();
                }
            }, duration);
        }

        return () => {
            if (cleanupTimeoutRef.current) {
                clearTimeout(cleanupTimeoutRef.current!);
            }
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current!);
            }
        };
    }, [show, message, emoji, particleCount, duration, colors, onComplete, isAnimating]);

    useEffect(() => {
        if (!show) {
            setParticles([]);
            setShowMessage(false);
            setIsAnimating(false);
        }
    }, [show]);

    if (!show && particles.length === 0 && !showMessage) {
        return null;
    }

    // 포털 생성을 위한 엘리먼트
    if (!portalRef.current) {
        portalRef.current = document.createElement('div');
    }

    return ReactDOM.createPortal(
        <>
            {particles.length > 0 && (
                <ConfettiContainer>
                    {particles.map((particle) => (
                        <ConfettiParticle
                            key={particle.id}
                            $x={particle.x}
                            $delay={particle.delay}
                            $duration={particle.duration}
                            $drift={particle.drift}
                            $rotation={particle.rotation}
                            $color={particle.color}
                        />
                    ))}
                </ConfettiContainer>
            )}

            {showMessage && message && (
                <SuccessMessage $show={showMessage}>
                    <SuccessIcon>{emoji}</SuccessIcon>
                    <SuccessText>{message}</SuccessText>
                </SuccessMessage>
            )}
        </>,
        document.body
    );
};

export default React.memo(Confetti);