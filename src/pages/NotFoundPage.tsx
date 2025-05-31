import React, {useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useApi} from '../context/ApiContext';
import NotFoundImg from '../assets/notfound.png'

const NotFoundImage = styled.img`
  width: 326px;
  height: 395px;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  object-fit: contain;
`;


const NotFoundContainer = styled.div`
  background: ${({theme}) => theme.skyColors[0]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: ${({theme}) => theme.spacing.xl};
  width: 100vw;
  margin: calc(-${({theme}) => theme.spacing.lg}) 0 calc(-${({theme}) => theme.spacing.lg}) 50%;
  transform: translateX(-50%);
  font-family: 'DXcutecute', 'Comic Sans MS', cursive;
`;

const ErrorCode = styled.h1`
  font-size: 72px;
  color: ${({theme}) => theme.colors.error};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ErrorMessage = styled.h2`
  font-size: 24px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const HomeLink = styled(Link)`
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({theme}) => theme.colors.secondary};
  color: #ffffff;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`;

const NotFoundPage: React.FC = () => {
    const api = useApi();

    // 컴포넌트 마운트 시 상태 코드 설정
    useEffect(() => {
        // api 객체가 존재하고 setStatusCode가 함수인지 확인
        if (api && typeof api.setStatusCode === 'function') {
            api.setStatusCode(404);
        }
    }, [api]);

    return (
        <NotFoundContainer>
            <NotFoundImage src={NotFoundImg} alt="Page Not Found"/>
            <ErrorCode>404</ErrorCode>
            <ErrorMessage>Page Not Found</ErrorMessage>
            <p>The resource you are looking for does not exist or has been moved.</p>
            <p style={{marginBottom: '30px'}}>Check the URL and try again.</p>
            <HomeLink to="/">Return to Home</HomeLink>
        </NotFoundContainer>
    );

};

export default NotFoundPage;