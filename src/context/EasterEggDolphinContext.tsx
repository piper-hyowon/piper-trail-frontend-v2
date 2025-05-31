import React, {createContext, useContext, useState, ReactNode} from 'react';

interface EasterEggContextType {
    easterEggUnlocked: boolean;
    setEasterEggUnlocked: (unlocked: boolean) => void;
    dolphinAccessGranted: boolean;
    setDolphinAccessGranted: (granted: boolean) => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

interface EasterEggProviderProps {
    children: ReactNode;
}

export const EasterEggProvider: React.FC<EasterEggProviderProps> = ({children}) => {
    const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);
    const [dolphinAccessGranted, setDolphinAccessGranted] = useState(false);

    return (
        <EasterEggContext.Provider value={{
            easterEggUnlocked,
            setEasterEggUnlocked,
            dolphinAccessGranted,
            setDolphinAccessGranted
        }}>
            {children}
        </EasterEggContext.Provider>
    );
};

export const useEasterEgg = () => {
    const context = useContext(EasterEggContext);
    if (context === undefined) {
        throw new Error('useEasterEgg must be used within an EasterEggProvider');
    }
    return context;
};