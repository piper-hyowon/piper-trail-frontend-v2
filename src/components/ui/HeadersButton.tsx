import React from 'react';
import styled from 'styled-components';

interface HeadersButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

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

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}30`};
  }
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({$isOpen}) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const HeadersButton: React.FC<HeadersButtonProps> = ({isOpen, onClick}) => {
    return (
        <StyledButton $isOpen={isOpen} onClick={onClick}>
            Headers <ChevronIcon $isOpen={isOpen}>{isOpen ? '▲' : '▼'}</ChevronIcon>
        </StyledButton>
    );
};

export default HeadersButton;