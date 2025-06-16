import React, {ReactNode, useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import NavigationBar from './NavigationBar';
import StatusBar from './StatusBar';
import FooterLinks from './FooterLinks';
import {useApi} from '../../context/ApiContext';

interface LayoutProps {
    children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: ${({theme}) => theme.gradients.contentBackground};
`;

const NavigationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: ${({theme}) => theme.gradients.contentBackground};
`;

const MainContentWrapper = styled.div<{ $navHeight: number; $footerHeight: number; $statusHeight: number }>`
  position: fixed;
  top: ${({$navHeight}) => $navHeight}px;
  bottom: ${({$footerHeight, $statusHeight}) => $footerHeight + $statusHeight}px;
  left: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StatusWrapper = styled.div<{ $footerHeight: number }>`
  position: fixed;
  bottom: ${({$footerHeight}) => $footerHeight}px;
  left: 0;
  right: 0;
  z-index: 150;
`;

const MainContent = styled.main`
  padding: ${({theme}) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  color: ${({theme}) => theme.colors.text};

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.md};
  }
`;

const FooterWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {statusCode} = useApi();
    const [navHeight, setNavHeight] = useState(150);
    const [footerHeight, setFooterHeight] = useState(100);
    const [statusHeight, setStatusHeight] = useState(80); // StatusBar 기본 높이
    const navRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const statusRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateHeights = () => {
            if (navRef.current) {
                setNavHeight(navRef.current!.offsetHeight);
            }
            if (footerRef.current) {
                setFooterHeight(footerRef.current!.offsetHeight);
            }
            if (statusRef.current) {
                setStatusHeight(statusRef.current!.offsetHeight);
            }
        };

        // 초기 높이 설정
        updateHeights();

        // ResizeObserver로 동적 높이 변화 감지
        const resizeObserver = new ResizeObserver(updateHeights);

        if (navRef.current) {
            resizeObserver.observe(navRef.current!);
        }
        if (footerRef.current) {
            resizeObserver.observe(footerRef.current!);
        }
        if (statusRef.current) {
            resizeObserver.observe(statusRef.current!);
        }

        // 윈도우 리사이즈 시에도 업데이트
        window.addEventListener('resize', updateHeights);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeights);
        };
    }, []);

    return (
        <LayoutContainer>
            <NavigationWrapper ref={navRef}>
                <NavigationBar/>
            </NavigationWrapper>

            <MainContentWrapper $navHeight={navHeight} $footerHeight={footerHeight} $statusHeight={statusHeight}>
                <MainContent>
                    {children}
                </MainContent>
            </MainContentWrapper>

            <StatusWrapper ref={statusRef} $footerHeight={footerHeight}>
                <StatusBar statusCode={statusCode ?? undefined}/>
            </StatusWrapper>

            <FooterWrapper ref={footerRef}>
                <FooterLinks/>
            </FooterWrapper>
        </LayoutContainer>
    );
};

export default Layout;