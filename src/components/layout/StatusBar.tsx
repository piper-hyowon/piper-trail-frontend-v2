import React from 'react';
import styled from 'styled-components';
import {useApi} from '../../context/ApiContext';

interface StatusBarProps {
    statusCode?: number;
    statusText?: string;
    timing?: number;
}

const StatusBarContainer = styled.div<{ $statusType: string }>`
  padding: ${({theme}) => theme.spacing.md};
  margin-top: auto;
  background: ${({theme}) => theme.gradients.transparentToSea};
  border: 2px solid ${({$statusType, theme}) =>
          $statusType === 'success' ? `${theme.colors.success}60` :
                  $statusType === 'warning' ? `${theme.colors.warning}60` :
                          `${theme.colors.error}60`
  };
  color: ${({$statusType, theme}) =>
          $statusType === 'success' ? theme.colors.success :
                  $statusType === 'warning' ? theme.colors.warning :
                          theme.colors.error
  };
  border-radius: ${({theme}) => theme.borderRadius};
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;

  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);

`;

const StatusContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: rgba(255, 255, 255, 0.7);
  padding: ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
`;

const ApiUrlDisplay = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  opacity: 0.8;
  margin-top: 5px;
`;

const StatusBar: React.FC<StatusBarProps> = ({statusCode: propStatusCode, statusText: propStatusText, timing}) => {
    // API 컨텍스트에서 상태 가져오기
    const {apiUrl, method, statusCode: contextStatusCode} = useApi();

    // 컨텍스트에 상태가 없으면 StatusBar 자체를 숨기거나 기본 상태 표시
    if (!contextStatusCode && !propStatusCode) {
        return null; // 또는 기본 상태 표시
    }

    // props가 제공되지 않으면 컨텍스트 값 사용
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
                <div>
                    <div>HTTP/1.1 {statusCode} {statusText}</div>
                    <ApiUrlDisplay>[{method}] {apiUrl}</ApiUrlDisplay>
                </div>
                {timing && <div>{timing}ms</div>}
            </StatusContent>
        </StatusBarContainer>
    );
};

function getStatusTextFromCode(code: number): string {
    switch (code) {
        case 200:
            return 'OK';
        case 201:
            return 'Created';
        case 204:
            return 'No Content';
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 405:
            return 'Method Not Allowed';
        case 500:
            return 'Internal Server Error';
        default:
            return 'Unknown Status';
    }
}

export default StatusBar;