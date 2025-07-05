import React, {ReactNode, useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';
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

const NavigationWrapper = styled.div<{ $isHidden: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({theme}) => theme.zIndex.navigation};
  background: ${({theme}) => theme.gradients.contentBackground};
  transform: translateY(${({$isHidden}) => $isHidden ? '-100%' : '0'});
  transition: transform 0.3s ease-in-out;
`;

const MainContentWrapper = styled.div<{
    $navHeight: number;
    $footerHeight: number;
    $statusHeight: number;
    $isFullWidth: boolean;
    $navHidden: boolean;
}>`
  position: fixed;
  top: ${({$navHeight, $navHidden}) => $navHidden ? 0 : $navHeight}px;
  bottom: ${({$footerHeight, $statusHeight}) => $footerHeight + $statusHeight}px;
  left: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background: ${({theme, $isFullWidth}) => $isFullWidth ? theme.skyColors[0] : theme.gradients.contentBackground};
  transition: top 0.3s ease-in-out;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({theme}) => theme.colors.primary}30;
    border-radius: 4px;
  }
`;

const StatusWrapper = styled.div<{ $footerHeight: number }>`
  position: fixed;
  bottom: ${({$footerHeight}) => $footerHeight}px;
  left: 0;
  right: 0;
  z-index: 150;
`;

const MainContent = styled.main<{ $isFullWidth: boolean }>`
  padding: ${({theme, $isFullWidth}) => $isFullWidth ? 0 : theme.spacing.lg};
  max-width: ${({$isFullWidth}) => $isFullWidth ? '100%' : '1200px'};
  margin: 0 auto;
  width: 100%;
  color: ${({theme}) => theme.colors.text};
  height: 100%;

  @media (max-width: 768px) {
    padding: ${({theme, $isFullWidth}) => $isFullWidth ? 0 : theme.spacing.md};
  }
`;

const FooterWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const FULL_WIDTH_ROUTES = [
    '/',
    '/dolphin',
    '/iloveyou',
    '/hello',
    '/coffee',
    '/cats',
    '/secret'
];

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {statusCode} = useApi();
    const location = useLocation();
    const [navHeight, setNavHeight] = useState(150);
    const [footerHeight, setFooterHeight] = useState(100);
    const [statusHeight, setStatusHeight] = useState(80);
    const [isNavHidden, setIsNavHidden] = useState(false);

    const navRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const statusRef = useRef<HTMLDivElement | null>(null);
    const mainContentRef = useRef<HTMLDivElement | null>(null);

    const lastScrollY = useRef(0);
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);

    const isFullWidth = FULL_WIDTH_ROUTES.includes(location.pathname);

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

        updateHeights();

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

        window.addEventListener('resize', updateHeights);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeights);
        };
    }, []);

    useEffect(() => {
        const mainContentElement = mainContentRef.current;
        if (!mainContentElement) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = mainContentElement.scrollTop;

                    // 스크롤 방향 감지
                    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                        // 아래로 스크롤 & 100px 이상 스크롤했을 때
                        setIsNavHidden(true);
                    } else if (currentScrollY < lastScrollY.current - 5) {
                        // 위로 5px 이상 스크롤
                        setIsNavHidden(false);
                    }

                    // 최상단에서는 항상 표시
                    if (currentScrollY < 50) {
                        setIsNavHidden(false);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;

                    // 스크롤이 멈춘 후 2초 뒤에 네비게이션 표시
                    if (scrollTimer.current) {
                        clearTimeout(scrollTimer.current!);
                    }

                    scrollTimer.current = setTimeout(() => {
                        setIsNavHidden(false);
                    }, 2000);
                });

                ticking = true;
            }
        };

        mainContentElement.addEventListener('scroll', handleScroll);

        return () => {
            mainContentElement.removeEventListener('scroll', handleScroll);
            if (scrollTimer.current) {
                clearTimeout(scrollTimer.current!);
            }
        };
    }, []);

    useEffect(() => {
        setIsNavHidden(false);
        if (mainContentRef.current) {
            mainContentRef.current!.scrollTop = 0;
        }
    }, [location.pathname]);

    return (
        <LayoutContainer>
            <NavigationWrapper ref={navRef} $isHidden={isNavHidden}>
                <NavigationBar/>
            </NavigationWrapper>

            <MainContentWrapper
                ref={mainContentRef}
                $navHeight={navHeight}
                $footerHeight={footerHeight}
                $statusHeight={statusHeight}
                $isFullWidth={isFullWidth}
                $navHidden={isNavHidden}
            >
                <MainContent $isFullWidth={isFullWidth}>
                    {children}
                </MainContent>
            </MainContentWrapper>

            <StatusWrapper ref={statusRef} $footerHeight={footerHeight}>
                <StatusBar statusCode={statusCode ?? undefined}/>
            </StatusWrapper>

            <FooterWrapper ref={footerRef}>
                <FooterLinks/>
            </FooterWrapper>

            <div
                id="modal-root"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 99999,
                    pointerEvents: 'none'
                }}
            />
        </LayoutContainer>
    );
};

export default Layout;