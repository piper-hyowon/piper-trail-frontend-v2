import React, {useState, useEffect} from 'react';
import styled, {keyframes, css, createGlobalStyle} from 'styled-components';
import {useLanguage} from "../context/LanguageContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEasterEgg} from "../context/EasterEggDolphinContext.tsx";

const fadeInBounce = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  60% {
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const wiggle = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
`;

const bubbleFloat = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.5);
  }
`;

export const DolphinPageFont = createGlobalStyle`
  @font-face {
    font-family: 'DXcutecute';
    src: url('/fonts/The Jamsil 3 Regular.ttf') format('truetype'); // TODO: 저작권 검색해보기
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const DolphinContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({theme}) => theme.gradients.transparentToSea};
  position: relative;
  overflow: hidden;
  width: 100%;

  /* DXcutecute 폰트 적용 */
  font-family: 'DXcutecute', 'Comic Sans MS', cursive;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.xl};
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${float} 3s ease-in-out infinite;
  font-family: 'DXcutecute', 'Comic Sans MS', cursive;
  font-weight: normal;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: ${({theme}) => theme.spacing.lg};
  }
`;

const DolphinImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DolphinImage = styled.img<{ $clicked: boolean }>`
  width: 300px;
  height: auto;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  animation: ${float} 4s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));

  ${({$clicked}) => $clicked && css`
    animation: ${wiggle} 0.5s ease-in-out, ${float} 4s ease-in-out infinite 0.5s;
  `}
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    width: 250px;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const SpeechBubble = styled.div<{ $show: boolean }>`
  position: absolute;
  top: -20px;
  right: -50px;
  background: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.md};
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  min-width: 200px;
  opacity: ${({$show}) => $show ? 1 : 0};
  visibility: ${({$show}) => $show ? 'visible' : 'hidden'};
  transform: ${({$show}) => $show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s ease-in-out;
  animation: ${({$show}) => $show ? fadeInBounce : 'none'} 0.5s ease-out;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 30px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 15px solid ${({theme}) => theme.colors.background};;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    right: -30px;
    max-width: 220px;
    min-width: 180px;
    padding: ${({theme}) => theme.spacing.sm};
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    right: -20px;
    top: -10px;
    max-width: 180px;
    min-width: 150px;

    &::before {
      left: 20px;
      border-left-width: 10px;
      border-right-width: 10px;
      border-top-width: 10px;
    }
  }
`;

const SpeechText = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.accent};
  font-size: 1rem;
  line-height: 1.4;
  text-align: center;
  font-weight: normal;
  font-family: 'DXcutecute', 'Noto Sans KR', sans-serif;
`;

const ClickHint = styled.div<{ $show: boolean }>`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.1rem;
  text-align: center;
  opacity: ${({$show}) => $show ? 0.8 : 0};
  transition: opacity 0.3s ease-in-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  animation: ${float} 2s ease-in-out infinite;
  font-family: 'DXcutecute', 'Comic Sans MS', cursive;

  @media (max-width: 768px) {
    bottom: 80px;
    font-size: 1rem;
  }
`;

const WaterBubble = styled.div<{ $delay: number; $left: number }>`
  position: absolute;
  bottom: 20px;
  left: ${({$left}) => $left}%;
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: ${bubbleFloat} 3s ease-in-out infinite;
  animation-delay: ${({$delay}) => $delay}s;
`;

const dolphinTranslations = {
    ko: {
        title: '🌊 신비로운 바다 친구 🐬',
        clickHint: '💫 돌고래를 클릭해보세요! 💫',
        clickCount: (count: number) => `와! ${count}번이나 클릭하셨네요! 🎉`,
        messages: [
            "어? 여기 누가 있나요?",
            "이런 곳까지 오시다니...",
            "비밀 장소를 발견하셨네요",
            "여기서 뭘 하고 계신가요?",
            "이 바다 어때요? 예쁘죠?",
            "오랜만에 누군가를 만났네요",
            "여기까지 어떻게 찾아오셨죠?",
            "타이밍이 완벽하셨군요!",
            "제가 점프하는 걸 보셨나요?",
            "어머, 제 점프를 놓치지 않으셨네요",
            "이런 깊은 곳까지 오시다니...",
            "혹시 저를 찾고 계셨나요?",
            "조용한 곳이었는데 반가운 손님이네요",
            "바다 깊은 곳의 비밀을 아시나요?",
            "이 곳을 아는 사람은 많지 않은데...",
            "멀리서 오셨군요",
            "여기서 만날 줄 몰랐어요",
            "안녕하세요! 반가워요!",
            "어머, 사람이다!",
            "같이 수영할래요?",
            "파도 소리 들어보세요~",
            "여기 경치가 정말 좋죠?",
            "가끔 이렇게 방문자가 와요",
            "REST 의 HATEOAS 도 찾아보세요!",
            "제가 바다의 비밀 주소들을 알려드릴게요~",
            "가끔 주소창에서 쿼리 파라미터를 직접 바꿔보세요!",
            "주소창에 hello 라고 인사해주세요!",
            "Coffee 좋아하세요? 주소창에 coffee 를 입력하면 한 잔 드릴게요!",
            "고양이 좋아하세요? 주소창에 cats 를 입력해보세요! 😽"
        ]
    },
    en: {
        title: '🌊 Mystical Ocean Friend 🐬',
        clickHint: '💫 Click the dolphin! 💫',
        clickCount: (count: number) => `Wow! You've clicked ${count} times! 🎉`,
        messages: [
            "Oh? Who's here?",
            "You came all the way here...",
            "You discovered a secret place!",
            "What are you doing here?",
            "How's this ocean? Beautiful, isn't it?",
            "It's been a while since I met someone",
            "How did you find your way here?",
            "Your timing is perfect!",
            "Did you see me jumping?",
            "Oh my, you didn't miss my jump!",
            "You came to such a deep place...",
            "Were you looking for me by any chance?",
            "It was a quiet place, but you're a welcome visitor",
            "Do you know the secrets of the deep sea?",
            "Not many people know this place...",
            "You came from far away",
            "I didn't expect to meet you here",
            "Hello! Nice to meet you!",
            "Oh my, a human!",
            "Want to swim together?",
            "Listen to the sound of the waves~",
            "The scenery here is really beautiful, right?",
            "Sometimes visitors come like this",
            "There are HATEOAS in REST somewhere",
            "Let me share the secret addresses of this ocean~",
            "Try changing the query parameters in the address bar sometimes!",
            "Say hello by typing 'hello' in the address bar!",
            "Do you like coffee? Type 'coffee' in the address bar and I'll give you a cup!",
            "Do you like cats? Try typing 'cats' in the address bar! 😽"
        ]
    }
};

const DolphinPage: React.FC = () => {
        const navigate = useNavigate()
        const [showBubble, setShowBubble] = useState(false);
        const [currentMessage, setCurrentMessage] = useState('');
        const [clickCount, setClickCount] = useState(0);
        const [isClicked, setIsClicked] = useState(false);
        const [isMounted, setIsMounted] = useState(false); // 마운트 상태 추가
        const {setEasterEggUnlocked} = useEasterEgg();
        const {language} = useLanguage();
        const t = dolphinTranslations[language];

        useEffect(() => {
            setIsMounted(true);

            return () => {
                setIsMounted(false);
            };
        }, []);

        useEffect(() => {
            if (!isMounted) return;

            const hasAccess = localStorage.getItem('dolphinAccess') === 'true';

            if (!hasAccess) {
                navigate('/404');
                return;
            }

            setEasterEggUnlocked(true);

        }, [isMounted, navigate, setEasterEggUnlocked]);

        useEffect(() => {
            return () => {
                if (isMounted) {
                    localStorage.removeItem('dolphinAccess');
                    setEasterEggUnlocked(false);
                }
            };
        }, [isMounted, setEasterEggUnlocked]);

        const handleDolphinClick = () => {
            setIsClicked(true);
            setClickCount(prev => prev + 1);

            const randomMessage = t.messages[Math.floor(Math.random() * t.messages.length)];
            setCurrentMessage(randomMessage);
            setShowBubble(true);

            setTimeout(() => {
                setIsClicked(false);
            }, 500);
        };

        const bubbles = Array.from({length: 8}, (_, i) => ({
            delay: i * 0.5,
            left: 10 + (i * 12)
        }));

        return (
            <>
                <DolphinPageFont/>
                <DolphinContainer>
                    {/* 배경 물방울들 */}
                    {bubbles.map((bubble, index) => (
                        <WaterBubble
                            key={index}
                            $delay={bubble.delay}
                            $left={bubble.left}
                        />
                    ))}

                    <Title>{t.title}</Title>

                    <DolphinImageContainer>
                        <DolphinImage
                            src="/images/dolphin.png"
                            alt={language === 'ko' ? '돌고래' : 'Dolphin'}
                            onClick={handleDolphinClick}
                            $clicked={isClicked}
                        />

                        <SpeechBubble $show={showBubble}>
                            <SpeechText>{currentMessage}</SpeechText>
                        </SpeechBubble>
                    </DolphinImageContainer>

                    <ClickHint $show={!showBubble}>
                        {t.clickHint}
                    </ClickHint>

                    {clickCount > 5 && (
                        <ClickHint $show={true} style={{bottom: '130px', fontSize: '0.9rem'}}>
                            {t.clickCount(clickCount)}
                        </ClickHint>
                    )}
                </DolphinContainer>
            </>
        );
    }
;

export default DolphinPage;