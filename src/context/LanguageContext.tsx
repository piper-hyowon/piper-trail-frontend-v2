import React, {createContext, useState, useContext, ReactNode, useCallback} from 'react';
import {translations, TranslationKey} from '../translations';

export type Language = 'ko' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
    const [language, setLanguageState] = useState<Language>('ko');

    const setLanguage = useCallback((newLang: Language) => {
        if (newLang !== language) {
            setLanguageState(newLang);
            if (window.apiClient) {
                window.apiClient.setLanguage(newLang);
            }
        }
    }, [language]);

    const toggleLanguage = useCallback(() => {
        const newLang = language === 'ko' ? 'en' : 'ko';
        setLanguage(newLang);
    }, [language, setLanguage]);

    const t = (key: TranslationKey): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key '${key}' not found for language '${language}'`);
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
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

export const useNamespaceT = (namespace: string) => {
    const {t} = useLanguage();
    return (key: string) => t(`${namespace}.${key}` as TranslationKey);
};

