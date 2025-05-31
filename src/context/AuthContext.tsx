import React, {createContext, useContext, useState, ReactNode, useCallback} from 'react';
import {useLogin, useTwoFactorAuth} from '../hooks/useApi';
import apiClient from '../services/apiClient';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        // 세션 스토리지에서 토큰 확인
        return !!sessionStorage.getItem('accessToken');
    });

    const loginMutation = useLogin();
    const twoFactorMutation = useTwoFactorAuth();

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await loginMutation.mutateAsync({username, password});

            if (response.qrCodeDataUrl) {
                // 2FA 설정 필요한 경우 (최초 로그인)
                // TODO: 2FA 설정 모달 표시
                console.log('2FA setup required:', response.qrCodeDataUrl);
                return false;
            }

            if (response.accessToken) {
                // 로그인 성공
                apiClient.setTokens(response.accessToken, response.refreshToken);
                setIsAuthenticated(true);
                return true;
            } else {
                // 2FA 코드 입력 필요
                // TODO: 2FA 코드 입력 모달 표시
                console.log('2FA code required');
                return false;
            }
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, [loginMutation]);

    const logout = useCallback(() => {
        apiClient.clearTokens();
        setIsAuthenticated(false);
    }, []);

    const value: AuthContextType = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};