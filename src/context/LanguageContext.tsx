import React, {createContext, useState, useContext, ReactNode} from 'react';
import {translations, TranslationKey} from '../translations';

type Language = 'ko' | 'en';

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
    const [language, setLanguage] = useState<Language>('ko');

    const toggleLanguage = (): void => {
        setLanguage(prev => (prev === 'ko' ? 'en' : 'ko'));
    };

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

