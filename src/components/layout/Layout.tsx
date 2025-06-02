import React, {ReactNode} from 'react';
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
  min-height: 100vh;

  background: ${({theme}) => theme.gradients.contentBackground};

`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({theme}) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background-color: transparent;
  color: ${({theme}) => theme.colors.text};
`;

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {statusCode} = useApi();

    return (
        <LayoutContainer>
            <NavigationBar/>
            <MainContent>
                {children}
            </MainContent>
            <StatusBar statusCode={statusCode ?? undefined}/>

            <FooterLinks/>

        </LayoutContainer>
    );
};

export default Layout;