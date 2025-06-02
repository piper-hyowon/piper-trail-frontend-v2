import React from 'react';
import styled, {css, keyframes} from 'styled-components';

interface StampSVGProps {
    stampType: string;
    color: string;
    name: string;
    selected: boolean;
    size?: number;
    showPressed?: boolean;
}

const stampClick = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.9) rotate(-2deg);
  }
  50% {
    transform: scale(0.95) rotate(1deg);
  }
  75% {
    transform: scale(1.02) rotate(-0.5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const stampPress = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(-5deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(0.95) rotate(-3deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(-5deg);
  }
`;

const StampContainer = styled.div<{ $size: number; $selected: boolean; $showPressed: boolean }>`
  width: ${({$size}) => $size}px;
  height: ${({$size}) => $size}px;
  position: relative;
  padding: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0) scale(1) rotate(0deg);

  &:hover {
    transform: translateY(-3px) scale(1.05) rotate(1deg);
  }

  ${({$selected}) => $selected && css`
    animation: ${stampClick} 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `}

  
    /* 우표 톱니 테두리 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background-image: /* 상단 톱니 */ radial-gradient(circle at 8px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 16px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 24px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 32px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 40px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 48px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 56px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 64px 0, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
      /* 하단 톱니 */ radial-gradient(circle at 8px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 16px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 24px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 32px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 40px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 48px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 56px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 64px 100%, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
      /* 좌측 톱니 */ radial-gradient(circle at 0 8px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 16px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 24px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 32px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 40px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 48px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 56px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 0 64px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
      /* 우측 톱니 */ radial-gradient(circle at 100% 8px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 16px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 24px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 32px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 40px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 48px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 56px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px),
    radial-gradient(circle at 100% 64px, transparent 2.5px, var(--border-color) 2.5px, var(--border-color) 4px, transparent 4px);
    background-size: 8px 8px;
    z-index: -1;
  }
`;

const StampPressed = styled.div<{ $visible: boolean; $color: string }>`
  opacity: ${({$visible}) => $visible ? 0.7 : 0};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-5deg);
  color: ${({$color}) => $color};
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: opacity 0.3s ease;
  z-index: 10;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);


  ${({$visible}) => $visible && css`
    animation: ${stampPress} 0.3s ease;
  `}
`;

const StampDesign: React.FC<{ type: string; size: number }> = ({type, size}) => {
    const iconSize = size * 0.8;

    switch (type) {
        case 'awesome':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #87ceeb 0%, #6bb6dd 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#87CEEB" stroke="white" strokeWidth="2"/>
                    {/* 선글라스 */}
                    <ellipse cx="28" cy="32" rx="10" ry="7" fill="#2c3e50"/>
                    <ellipse cx="52" cy="32" rx="10" ry="7" fill="#2c3e50"/>
                    <rect x="38" y="30" width="4" height="4" fill="#2c3e50"/>
                    {/* 하이라이트 */}
                    <ellipse cx="24" cy="29" rx="3" ry="2" fill="white" opacity="0.7"/>
                    <ellipse cx="48" cy="29" rx="3" ry="2" fill="white" opacity="0.7"/>
                    {/* 입 */}
                    <path d="M25 52 Q40 62 55 52" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    {/* 볼 */}
                    <circle cx="18" cy="47" r="4" fill="white" opacity="0.6"/>
                    <circle cx="62" cy="47" r="4" fill="white" opacity="0.6"/>
                </svg>
            );

        case 'interesting':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #dda0dd 0%, #d194d6 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#DDA0DD" stroke="white" strokeWidth="2"/>
                    {/* 눈 */}
                    <ellipse cx="30" cy="35" rx="4" ry="5" fill="white"/>
                    <ellipse cx="50" cy="35" rx="4" ry="5" fill="white"/>
                    <circle cx="30" cy="35" r="3" fill="#2c3e50"/>
                    <circle cx="50" cy="35" r="3" fill="#2c3e50"/>
                    <circle cx="31" cy="33" r="1" fill="white"/>
                    <circle cx="51" cy="33" r="1" fill="white"/>
                    {/* 눈썹 */}
                    <path d="M25 28 Q30 26 35 28" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M45 28 Q50 26 55 28" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    {/* 입 (O모양) */}
                    <ellipse cx="40" cy="52" rx="5" ry="7" fill="white" stroke="#2c3e50" strokeWidth="2"/>
                    {/* 물음표 */}
                    <path d="M57 18 Q62 13 67 18 Q62 23 57 23" stroke="white" strokeWidth="3" fill="none"
                          strokeLinecap="round"/>
                    <circle cx="59" cy="28" r="2" fill="white"/>
                </svg>
            );

        case 'helpful':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #90ee90 0%, #7dd87d 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#90EE90" stroke="white" strokeWidth="2"/>
                    {/* 눈 */}
                    <ellipse cx="30" cy="35" rx="3.5" ry="4" fill="white"/>
                    <ellipse cx="50" cy="35" rx="3.5" ry="4" fill="white"/>
                    <circle cx="30" cy="35" r="2.5" fill="#2c3e50"/>
                    <circle cx="50" cy="35" r="2.5" fill="#2c3e50"/>
                    <circle cx="31" cy="33" r="0.8" fill="white"/>
                    <circle cx="51" cy="33" r="0.8" fill="white"/>
                    {/* 미소 */}
                    <path d="M27 50 Q40 60 53 50" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    {/* 전구 */}
                    <circle cx="40" cy="16" r="7" fill="#FFD700" stroke="white" strokeWidth="2"/>
                    <rect x="36" y="23" width="8" height="4" fill="#E6E6FA" stroke="white" strokeWidth="1"/>
                    <rect x="36" y="27" width="8" height="2" fill="#E6E6FA" stroke="white" strokeWidth="1"/>
                    {/* 전구 빛 */}
                    <path d="M30 13 L27 9" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M50 13 L53 9" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M40 8 L40 4" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            );

        case 'inspiring':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #ffe4b5 0%, #ffbc7a 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#FFE4B5" stroke="white" strokeWidth="2"/>
                    {/* 눈 (반짝이는) */}
                    <ellipse cx="30" cy="35" rx="4" ry="5" fill="white"/>
                    <ellipse cx="50" cy="35" rx="4" ry="5" fill="white"/>
                    <circle cx="30" cy="35" r="3" fill="#2c3e50"/>
                    <circle cx="50" cy="35" r="3" fill="#2c3e50"/>
                    {/* 눈 반짝임 */}
                    <path d="M27 32 L30 29 L33 32 L30 35 Z" fill="white"/>
                    <path d="M47 32 L50 29 L53 32 L50 35 Z" fill="white"/>
                    <circle cx="31" cy="33" r="1" fill="white"/>
                    <circle cx="51" cy="33" r="1" fill="white"/>
                    {/* 미소 */}
                    <path d="M25 50 Q40 62 55 50" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    {/* 별들 */}
                    <path d="M18 18 L20 25 L27 25 L22 29 L24 36 L18 32 L12 36 L14 29 L9 25 L16 25 Z" fill="#FFD700"/>
                    <path d="M62 22 L63 27 L68 27 L65 30 L66 35 L62 32 L58 35 L59 30 L56 27 L61 27 Z" fill="#FFD700"/>
                    <path d="M57 12 L58 15 L61 15 L59 17 L60 20 L57 18 L54 20 L55 17 L53 15 L56 15 Z" fill="#FFD700"/>
                </svg>
            );

        case 'thank_you':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #ffdab9 0%, #ff9aab 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#FFDAB9" stroke="white" strokeWidth="2"/>
                    {/* 눈 (감은 눈) */}
                    <path d="M23 35 Q30 32 37 35" stroke="#2c3e50" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    <path d="M43 35 Q50 32 57 35" stroke="#2c3e50" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    {/* 속눈썹 */}
                    <path d="M26 33 L27 30" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M30 32 L31 29" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M34 33 L35 30" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M46 33 L47 30" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M50 32 L51 29" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M54 33 L55 30" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round"/>
                    {/* 행복한 미소 */}
                    <path d="M23 52 Q40 65 57 52" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    {/* 볼터기 */}
                    <circle cx="19" cy="50" r="5" fill="#FFB6C1" opacity="0.8"/>
                    <circle cx="61" cy="50" r="5" fill="#FFB6C1" opacity="0.8"/>
                    {/* 작은 하트들 */}
                    <path
                        d="M17 22 C15 20, 12 20, 12 23 C12 25, 17 30 17 30 C17 30, 22 25, 22 23 C22 20, 19 20, 17 22 Z"
                        fill="#FF69B4" opacity="0.7"/>
                    <path
                        d="M63 17 C62 16, 60 16, 60 18 C60 19, 63 23 63 23 C63 23, 66 19, 66 18 C66 16, 64 16, 63 17 Z"
                        fill="#FF69B4" opacity="0.7"/>
                </svg>
            );

        case 'love_it':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #ffb6c1 0%, #ff99cc 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    {/* 얼굴 */}
                    <circle cx="40" cy="40" r="35" fill="#FFB6C1" stroke="white" strokeWidth="2"/>
                    {/* 하트 모양 눈 */}
                    <path
                        d="M26 30 C24 28, 21 28, 21 31 C21 33, 26 39, 26 39 C26 39, 31 33, 31 31 C31 28, 28 28, 26 30 Z"
                        fill="#e74c3c"/>
                    <path
                        d="M54 30 C52 28, 49 28, 49 31 C49 33, 54 39, 54 39 C54 39, 59 33, 59 31 C59 28, 56 28, 54 30 Z"
                        fill="#e74c3c"/>
                    {/* 하트 눈 하이라이트 */}
                    <ellipse cx="24" cy="31" rx="2" ry="1.5" fill="white" opacity="0.8"/>
                    <ellipse cx="52" cy="31" rx="2" ry="1.5" fill="white" opacity="0.8"/>
                    {/* 입 (키스) */}
                    <ellipse cx="40" cy="54" rx="4" ry="3" fill="white" stroke="#e74c3c" strokeWidth="2"/>
                    {/* 볼터기 */}
                    <circle cx="15" cy="47" r="6" fill="#FF1493" opacity="0.6"/>
                    <circle cx="65" cy="47" r="6" fill="#FF1493" opacity="0.6"/>
                    {/* 플로팅 하트들 */}
                    <path d="M12 12 C10 10, 7 10, 7 13 C7 15, 12 21, 12 21 C12 21, 17 15, 17 13 C17 10, 14 10, 12 12 Z"
                          fill="#FF1493" opacity="0.8"/>
                    <path
                        d="M68 15 C67 14, 65 14, 65 16 C65 17, 68 21 68 21 C68 21, 71 17, 71 16 C71 14, 69 14, 68 15 Z"
                        fill="#FF1493" opacity="0.8"/>
                    <path
                        d="M62 7 C61.5 6.5, 60.5 6.5, 60.5 7.5 C60.5 8, 62 10 62 10 C62 10, 63.5 8, 63.5 7.5 C63.5 6.5, 62.5 6.5, 62 7 Z"
                        fill="#FF1493" opacity="0.8"/>
                    {/* 반짝임 */}
                    <circle cx="22" cy="17" r="1.5" fill="white" opacity="0.9"/>
                    <circle cx="58" cy="22" r="2" fill="white" opacity="0.9"/>
                </svg>
            );

        default:
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 80 80" style={{
                    background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                    borderRadius: '50%',
                    border: '2px solid white'
                }}>
                    <circle cx="40" cy="40" r="35" fill="#ccc" stroke="white" strokeWidth="2"/>
                    <text x="40" y="50" textAnchor="middle" fontSize="20" fill="white">?</text>
                </svg>
            );
    }
};

const StampSVG: React.FC<StampSVGProps> = ({
                                               stampType,
                                               color,
                                               name,
                                               selected,
                                               size = 80,
                                               showPressed = false
                                           }) => {
    const stampColors = {
        awesome: {border: '#87ceeb', stamp: '#4682b4'},
        interesting: {border: '#dda0dd', stamp: '#9932cc'},
        helpful: {border: '#90ee90', stamp: '#228b22'},
        inspiring: {border: '#ffd1a9', stamp: '#ff8c00'},
        thank_you: {border: '#ffb3ba', stamp: '#dc143c'},
        love_it: {border: '#ffb3d9', stamp: '#e91e63'}
    };

    const colors = stampColors[stampType as keyof typeof stampColors] || {border: color, stamp: color};

    return (
        <StampContainer
            $size={size}
            $selected={selected}
            $showPressed={selected && showPressed}
            style={{
                '--border-color': colors.border
            } as React.CSSProperties}
        >
            <StampDesign type={stampType} size={size}/>

            <StampPressed
                $visible={selected}
                $color={colors.stamp}
            >
                {getStampPressedText(stampType)}
            </StampPressed>
        </StampContainer>
    );
};

const getStampPressedText = (stampType: string) => {
    switch (stampType) {
        case 'awesome':
            return 'COOL';
        case 'interesting':
            return 'INTERESTING';
        case 'helpful':
            return 'HELPFUL';
        case 'inspiring':
            return 'INSPIRING';
        case 'thank_you':
            return 'THANKFUL';
        case 'love_it':
            return 'LOVE';
        default:
            return 'STAMP';
    }
};

export default StampSVG;