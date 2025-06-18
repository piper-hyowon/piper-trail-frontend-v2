import React from 'react';
import styled from 'styled-components';
import {Navigate, useLocation} from 'react-router-dom';

const EasterEggContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  width: 100%;
  font-family: 'DXcutecute', 'Comic Sans MS', cursive;
`;

const Message = styled.h2`
  font-size: 24px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const EasterEggPage: React.FC = () => {
    const location = useLocation();

    let message: string = '';

    switch (location.pathname) {
        case '/iloveyou':
            message = 'me too 💕';
            break;
        case '/hello':
            message = 'Hello there! 👋';
            break;
        case '/coffee':
            message = 'Here\'s your virtual coffee ☕';
            break;
        case '/cats':
            message = 'Meow! 🐱';
            break;
        case '/secret':
            message = 'Shh... this is our little secret 🤫';
            break;
    }

    return (
        <EasterEggContainer>
            <Message>{message}</Message>
        </EasterEggContainer>
    );
};

export default EasterEggPage;