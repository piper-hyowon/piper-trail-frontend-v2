import React from 'react';
import styled from 'styled-components';
import {AcceptHeader, useApi} from '../../context/ApiContext';

interface HeadersPanelProps {
    acceptHeader: AcceptHeader;
    onAcceptHeaderChange: (header: string) => void;
}

const PanelContainer = styled.div`
  background-color: ${({theme}) => `${theme.colors.secondaryBackground}`};
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.sm};
`;

const HeaderTitle = styled.h3`
  margin: 0 0 ${({theme}) => theme.spacing.sm} 0;
  font-size: ${({theme}) => theme.fontSizes.medium};
  color: ${({theme}) => theme.colors.primary};
`;

const HeaderGroup = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const HeaderLabel = styled.label`
  display: block;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const HeaderSelect = styled.select`
  background-color: ${({theme}) => theme.colors.background};
  border: 1px solid ${({theme}) => `${theme.colors.primary}40`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  width: 100%;
  color: ${({theme}) => theme.colors.text};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const HeaderValue = styled.div`
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({theme}) => theme.colors.background};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-family: 'Roboto Mono', monospace;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const AuthStatus = styled.div<{ $authenticated: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  font-family: 'Roboto Mono', monospace;
  font-size: ${({theme}) => theme.fontSizes.small};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({theme, $authenticated}) =>
          $authenticated ? `${theme.colors.success}10` : theme.colors.background};
  border: 1px solid ${({theme, $authenticated}) =>
          $authenticated ? `${theme.colors.success}30` : `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  color: ${({theme, $authenticated}) =>
          $authenticated ? theme.colors.success : theme.colors.error};
`;

const HeadersPanel: React.FC<HeadersPanelProps> = ({acceptHeader, onAcceptHeaderChange}) => {
    const {isAuthenticated} = useApi();

    const handleAcceptHeaderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onAcceptHeaderChange(e.target.value);
    };

    return (
        <PanelContainer>
            <HeaderTitle>Headers</HeaderTitle>

            <HeaderGroup>
                <HeaderLabel htmlFor="acceptHeader">Accept:</HeaderLabel>
                <HeaderSelect
                    id="acceptHeader"
                    value={acceptHeader}
                    onChange={handleAcceptHeaderChange}
                >
                    <option value="application/json">application/json</option>
                    <option value="text/html">text/html</option>
                </HeaderSelect>
            </HeaderGroup>

            <HeaderGroup>
                <HeaderLabel>Authorization:</HeaderLabel>
                <AuthStatus $authenticated={isAuthenticated}>
                    {isAuthenticated ? '🔒 Bearer token-***' : '🔓 Not authenticated'}
                </AuthStatus>
            </HeaderGroup>

            <HeaderGroup>
                <HeaderLabel>User-Agent:</HeaderLabel>
                <HeaderValue>
                    Piper-Trail-ApiExplorer/1.0
                </HeaderValue>
            </HeaderGroup>
        </PanelContainer>
    );
};

export default HeadersPanel;