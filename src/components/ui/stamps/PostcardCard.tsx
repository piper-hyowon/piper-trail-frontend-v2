import React from 'react';
import styled, {keyframes} from 'styled-components';
import StampSVG from './StampSVG';

interface PostcardCardProps {
    entry: {
        id: number;
        stampId: string;
        message?: string;
        timestamp: Date;
        nickname: string;
    };
    stampInfo: {
        id: string;
        name: string;
        color: string;
        description: string;
    } | undefined;
    index: number;
}

const postcardFall = keyframes`
  0% {
    transform: translate3d(0, -50px, 0) scale3d(0.8, 0.8, 1);
    opacity: 0;
  }
  50% {
    transform: translate3d(0, 0, 0) scale3d(0.9, 0.9, 1);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    opacity: 1;
  }
`;

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
        linear-gradient(60deg, transparent 40%, rgba(255, 182, 193, 0.05) 45%, rgba(255, 182, 193, 0.05) 55%, transparent 60%),
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

const getCardPattern = (stampType: string): string => {
    return CARD_PATTERNS[stampType] || CARD_PATTERNS['default'];
};

const CardContainer = styled.div<{ $stampType: string; $index: number }>`
  background: ${({$stampType}) => getCardPattern($stampType)},
  linear-gradient(135deg, #fefefe 0%, #faf9f7 100%);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: ${postcardFall} 0.8s ease-out;
  animation-delay: ${({$index}) => $index * 0.15}s;
  animation-fill-mode: both;
  will-change: transform; 

  &:hover {
    transform: translate3d(0, -5px, 0); /* GPU 가속 사용 */
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

const FromHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  transform: rotate(-0.8deg);
  color: #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FromNickname = styled.span`
  color: #e74c3c;
`;

const FromDate = styled.span`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
  transform: rotate(0.5deg);
`;

const MessageText = styled.div<{ $hasMessage: boolean }>`
  font-size: ${({$hasMessage}) => $hasMessage ? '16px' : '15px'};
  font-weight: 400;
  color: ${({$hasMessage}) => $hasMessage ? '#2c3e50' : '#7f8c8d'};
  transform: rotate(0.3deg);
  font-style: ${({$hasMessage}) => $hasMessage ? 'normal' : 'italic'};
  margin-left: 10px;
  line-height: 1.4;
  margin-bottom: 15px;
`;

const StampContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
};

const PostcardCard: React.FC<PostcardCardProps> = React.memo(({entry, stampInfo, index}) => {
    const hasMessage = React.useMemo(() =>
            (entry.message && entry.message.trim().length > 0),
        [entry.message]
    );

    const displayMessage = React.useMemo(() =>
            hasMessage
                ? `"${entry.message}"`
                : (stampInfo?.description || '마음을 담은 도장을 보내주셨어요 💕'),
        [hasMessage, entry.message, stampInfo?.description]
    );

    const formattedDate = React.useMemo(() =>
            formatTimestamp(entry.timestamp),
        [entry.timestamp]
    );

    return (
        <CardContainer $stampType={entry.stampId} $index={index}>
            <WrittenText>
                <FromHeader>
                    <span>From. <FromNickname>{entry.nickname}</FromNickname></span>
                    <FromDate>{formattedDate}</FromDate>
                </FromHeader>
                <MessageText $hasMessage={hasMessage}>
                    {displayMessage}
                </MessageText>
            </WrittenText>

            <StampContainer>
                <StampSVG
                    stampType={entry.stampId}
                    color={stampInfo?.color || '#ccc'}
                    name={stampInfo?.name || ''}
                    selected={false}
                    size={120}
                />
            </StampContainer>
        </CardContainer>
    );
});

PostcardCard.displayName = 'PostcardCard';

export default PostcardCard;