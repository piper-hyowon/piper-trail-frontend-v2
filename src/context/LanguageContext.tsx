import React, {createContext, useState, useContext, ReactNode} from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        'blogTitle': 'Footprints out of the well',
        'adminAccess': 'Admin access only',
        'login': 'Login',
        'dolphin.title': '🌊 Mystical Ocean Friend 🐬',
        'dolphin.clickHint': '💫 Click the dolphin! 💫',
        'dolphin.altText': 'Dolphin',
    },
    ko: {
        'blogTitle': '우물 밖으로의 발자국을 기록하는 공간',
        'adminAccess': '관리자 전용',
        'login': '로그인',
        'dolphin.title': '🌊 신비로운 바다 친구 🐬',
        'dolphin.clickHint': '💫 돌고래를 클릭해보세요! 💫',
        'dolphin.altText': '돌고래',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
    const [language, setLanguage] = useState<Language>('ko');

    const toggleLanguage = (): void => {
        setLanguage(prev => (prev === 'ko' ? 'en' : 'ko'));
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{language, toggleLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};