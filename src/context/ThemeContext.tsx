import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';
import {theme, ThemeMode} from '../styles/theme';

type ThemeContextType = {
    themeMode: ThemeMode;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    // 시스템 테마 감지 또는 로컬 저장소에서 복원
    const [themeMode, setThemeMode] = useState<ThemeMode>('light'); // 기본값 설정

    useEffect(() => {
        // 컴포넌트 마운트 후 로컬 스토리지 확인
        const savedTheme = localStorage.getItem('theme') as ThemeMode;
        if (savedTheme) {
            setThemeMode(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeMode('dark');
        }
    }, []);

    const toggleTheme = () => {
        setThemeMode(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    const currentTheme = themeMode === 'light' ? theme.light : theme.dark;

    // 테마 변경 시 HTML 속성 업데이트
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    // TODO: error
    return (
        <ThemeContext.Provider value={{themeMode, toggleTheme}}>
            <StyledThemeProvider theme={currentTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};