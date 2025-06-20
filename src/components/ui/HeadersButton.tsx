import React, {useState, useEffect, useRef} from 'react';
import styled, {keyframes} from 'styled-components';

interface HeadersButtonProps {
    isOpen: boolean;
    onClick: () => void;
    currentPath?: string;
    tooltipText?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled.button<{ $isOpen: boolean }>`
  background-color: ${({theme}) => theme.colors.secondaryBackground};
  border: 2px solid ${({theme, $isOpen}) => $isOpen
          ? theme.colors.primary
          : `${theme.colors.primary}50`
  };
  border-radius: ${({theme}) => theme.borderRadius};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}30`};
  }
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({$isOpen}) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const TooltipBubble = styled.div<{ $isVisible: boolean; $shouldRender: boolean }>`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: ${({theme}) => theme.fontSizes.small};
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: ${({$isVisible}) => $isVisible ? fadeIn : fadeOut} 0.3s ease-in-out;
  opacity: ${({$isVisible}) => $isVisible ? 1 : 0};
  pointer-events: none;
  z-index: 1000;
  display: ${({$shouldRender}) => $shouldRender ? 'block' : 'none'};

  /* 화면 너비에 따라 위치 조정 */
  @media (max-width: 1200px) {
    left: auto;
    right: -10px;
    transform: none;
  }

  @media (max-width: 768px) {
    right: 0;
    font-size: 0.75rem;
    padding: 4px 8px;
    white-space: normal;
    max-width: 180px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({theme}) => theme.colors.primary};

    @media (max-width: 1200px) {
      left: auto;
      right: 30px;
      transform: none;
    }

    @media (max-width: 768px) {
      right: 20px;
    }
  }
`;

const HeadersButton: React.FC<HeadersButtonProps> = ({isOpen, onClick, currentPath = '/', tooltipText}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [shouldRenderTooltip, setShouldRenderTooltip] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearAllTimeouts = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current!);
            hideTimeoutRef.current = null;
        }
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current!);
            showTimeoutRef.current = null;
        }
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current!);
            animationTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        // 홈페이지('/')로 이동할 때마다 툴팁 표시
        if (currentPath === '/') {
            clearAllTimeouts();

            setShouldRenderTooltip(true);

            showTimeoutRef.current = setTimeout(() => {
                setShowTooltip(true);

                // 3초 후 툴팁 숨기기
                hideTimeoutRef.current = setTimeout(() => {
                    setShowTooltip(false);

                    animationTimeoutRef.current = setTimeout(() => {
                        setShouldRenderTooltip(false);
                    }, 300);
                }, 3000);
            }, 500);
        }

        return () => {
            clearAllTimeouts();
        };
    }, [currentPath]);

    // 페이지 이동 시 즉시 툴팁 숨기기
    useEffect(() => {
        if (currentPath !== '/') {
            clearAllTimeouts();
            setShowTooltip(false);
            setShouldRenderTooltip(false);
        }
    }, [currentPath]);

    useEffect(() => {
        return () => {
            clearAllTimeouts();
        };
    }, []);

    return (
        <ButtonWrapper>
            <TooltipBubble
                $isVisible={showTooltip}
                $shouldRender={shouldRenderTooltip}
            >
                {tooltipText || 'Change API response format (JSON/HTML)'}
            </TooltipBubble>
            <StyledButton $isOpen={isOpen} onClick={onClick}>
                Headers <ChevronIcon $isOpen={isOpen}>{isOpen ? '▲' : '▼'}</ChevronIcon>
            </StyledButton>
        </ButtonWrapper>
    );
};

export default HeadersButton;