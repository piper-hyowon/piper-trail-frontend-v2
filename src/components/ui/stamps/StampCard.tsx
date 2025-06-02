import React from 'react';
import styled from 'styled-components';
import StampSVG from './StampSVG';

interface StampCardProps {
    stamp: {
        id: string;
        name: string;
        color: string;
        description: string;
    };
    selected: boolean;
    onClick: () => void;
}

const CARD_PATTERNS: Record<string, string> = {
    'awesome': `
        radial-gradient(circle at 20% 20%, rgba(135, 206, 235, 0.08) 0%, transparent 50%),
        linear-gradient(45deg, transparent 40%, rgba(173, 216, 230, 0.05) 45%, rgba(173, 216, 230, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(-30deg, transparent, transparent 15px, rgba(176, 224, 230, 0.03) 15px, rgba(176, 224, 230, 0.03) 30px)
    `,
    'interesting': `
        radial-gradient(circle at 80% 30%, rgba(221, 160, 221, 0.08) 0%, transparent 50%),
        linear-gradient(-45deg, transparent 40%, rgba(218, 112, 214, 0.05) 45%, rgba(218, 112, 214, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(60deg, transparent, transparent 20px, rgba(216, 191, 216, 0.03) 20px, rgba(216, 191, 216, 0.03) 35px)
    `,
    'helpful': `
        radial-gradient(circle at 30% 70%, rgba(144, 238, 144, 0.08) 0%, transparent 50%),
        linear-gradient(30deg, transparent 40%, rgba(152, 251, 152, 0.05) 45%, rgba(152, 251, 152, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(-60deg, transparent, transparent 18px, rgba(154, 205, 50, 0.03) 18px, rgba(154, 205, 50, 0.03) 32px)
    `,
    'inspiring': `
        radial-gradient(circle at 70% 80%, rgba(255, 209, 169, 0.08) 0%, transparent 50%),
        linear-gradient(-30deg, transparent 40%, rgba(255, 218, 185, 0.05) 45%, rgba(255, 218, 185, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255, 228, 196, 0.03) 22px, rgba(255, 228, 196, 0.03) 38px)
    `,
    'thank_you': `
        radial-gradient(circle at 40% 20%, rgba(255, 179, 186, 0.08) 0%, transparent 50%),
        linear-gradient(60deg, transparent, transparent 40%, rgba(255, 182, 193, 0.05) 45%, rgba(255, 182, 193, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(-45deg, transparent, transparent 16px, rgba(255, 192, 203, 0.03) 16px, rgba(255, 192, 203, 0.03) 28px)
    `,
    'love_it': `
        radial-gradient(circle at 60% 40%, rgba(255, 179, 217, 0.08) 0%, transparent 50%),
        linear-gradient(-60deg, transparent 40%, rgba(255, 105, 180, 0.05) 45%, rgba(255, 105, 180, 0.05) 55%, transparent 60%),
        repeating-linear-gradient(30deg, transparent, transparent 14px, rgba(255, 20, 147, 0.03) 14px, rgba(255, 20, 147, 0.03) 26px)
    `,
    'default': `
        radial-gradient(circle at 50% 50%, rgba(200, 200, 200, 0.08) 0%, transparent 50%),
        linear-gradient(45deg, transparent 40%, rgba(220, 220, 220, 0.05) 45%, rgba(220, 220, 220, 0.05) 55%, transparent 60%)
    `
};

const STAMP_TEXTS: Record<string, { title: string; subtitle: string }> = {
    'awesome': {title: '멋져요~', subtitle: 'really cool!'},
    'interesting': {title: '흥미로워요!', subtitle: 'so interesting'},
    'helpful': {title: '도움돼요', subtitle: 'very helpful'},
    'inspiring': {title: '영감받았어요~', subtitle: 'inspiring!'},
    'thank_you': {title: '고마워요♥', subtitle: 'thank you so much'},
    'love_it': {title: '사랑해요💕', subtitle: 'love it!'},
    'default': {title: '도장', subtitle: 'stamp'}
};

const getCardPattern = (stampType: string): string => {
    return CARD_PATTERNS[stampType] || CARD_PATTERNS['default'];
};

const getStampTexts = (stampType: string) => {
    return STAMP_TEXTS[stampType] || STAMP_TEXTS['default'];
};

const CardContainer = styled.div<{ $stampType: string }>`
  background: ${({$stampType}) => getCardPattern($stampType)},
  linear-gradient(135deg, #fefefe 0%, #faf9f7 100%);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  will-change: transform;

  &:hover {
    transform: translate3d(0, -5px, 0);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
`;

const WrittenText = styled.div`
  font-family: 'Dancing Script', cursive;
  color: #2c3e50;
  margin-bottom: 20px;
  position: relative;
  text-align: left;
  padding-left: 15px;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 10px;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, rgba(44, 62, 80, 0.3) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 20px;
    width: 3px;
    height: 3px;
    background: radial-gradient(circle, rgba(44, 62, 80, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

const StampTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  transform: rotate(-1.2deg);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: #34495e;
  line-height: 1.2;
`;

const StampSubtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #7f8c8d;
  transform: rotate(0.8deg);
  font-style: italic;
  margin-left: 20px;
`;

const StampContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const StampCard: React.FC<StampCardProps> = React.memo(({stamp, selected, onClick}) => {
    const texts = React.useMemo(() => getStampTexts(stamp.id), [stamp.id]);

    return (
        <CardContainer $stampType={stamp.id} onClick={onClick}>
            <WrittenText>
                <StampTitle>{texts.title}</StampTitle>
                <StampSubtitle>{texts.subtitle}</StampSubtitle>
            </WrittenText>

            <StampContainer>
                <StampSVG
                    stampType={stamp.id}
                    color={stamp.color}
                    name={stamp.name}
                    selected={selected}
                    size={120}
                />
            </StampContainer>
        </CardContainer>
    );
});

StampCard.displayName = 'StampCard';

export default StampCard;