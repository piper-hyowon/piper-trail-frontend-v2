import React from 'react';
import styled from 'styled-components';
import {useApi} from '../../context/ApiContext';

interface StatusBarProps {
    statusCode?: number;
    statusText?: string;
    timing?: number;
}

const StatusBarContainer = styled.div<{ $statusType: string }>`
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => theme.gradients.transparentToSea};
  border-top: 1px solid ${({$statusType, theme}) =>
          $statusType === 'success' ? `${theme.colors.success}40` :
                  $statusType === 'warning' ? `${theme.colors.warning}40` :
                          `${theme.colors.error}40`
  };
  color: ${({$statusType, theme}) =>
          $statusType === 'success' ? theme.colors.success :
                  $statusType === 'warning' ? theme.colors.warning :
                          theme.colors.error
  };
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
`;

const StatusContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.7);
  padding: ${({theme}) => theme.spacing.xs};
  border-radius: ${({theme}) => theme.borderRadius};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

const StatusInfo = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: ${({theme}) => theme.spacing.xs};
  }
`;

const StatusCode = styled.span`
  font-weight: bold;
`;

const ApiUrl = styled.span`
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const Timing = styled.span`
  font-size: 11px;
  opacity: 0.7;
`;

const StatusBar: React.FC<StatusBarProps> = ({statusCode: propStatusCode, statusText: propStatusText, timing}) => {
    const {apiUrl, method, statusCode: contextStatusCode} = useApi();

    if (!contextStatusCode && !propStatusCode) {
        return null;
    }

    const statusCode = propStatusCode || contextStatusCode || 200;
    const statusText = propStatusText || getStatusTextFromCode(statusCode);

    const getStatusType = (code: number): string => {
        if (code >= 200 && code < 300) return 'success';
        if (code >= 300 && code < 400) return 'warning';
        return 'error';
    };

    const statusType = getStatusType(statusCode);

    return (
        <StatusBarContainer $statusType={statusType}>
            <StatusContent>
                <StatusInfo>
                    <StatusCode>{statusCode} {statusText}</StatusCode>
                    <ApiUrl>[{method}] {apiUrl}</ApiUrl>
                </StatusInfo>
                {timing && <Timing>{timing}ms</Timing>}
            </StatusContent>
        </StatusBarContainer>
    );
};

function getStatusTextFromCode(code: number): string {
    const statusTexts: Record<number, string> = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        500: 'Internal Server Error'
    };

    return statusTexts[code] || 'Unknown Status';
}

export default StatusBar;