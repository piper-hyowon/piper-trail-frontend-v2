export type ThemeMode = 'light' | 'dark';

export interface Theme {
    zIndex: {
        footer: number;
        statusBar: number;
        navigation: number;
        modal: number;
        modalOverlay: number;
        tooltip: number;
    };
    gradients: {
        skyToTransparent: string;
        transparentToSea: string;
        seaGradient: string;
        contentBackground: string;
        purpleGradient: string;
        orangeGradient: string;
        pinkGradient: string;
        techGradient: string;
        socialGradient: string;
    };
    colors: {
        background: string;
        secondaryBackground: string;
        backgroundTertiary: string;
        surface?: string;
        text: string;
        primary: string;
        secondary: string;
        accent?: string;
        success: string;
        warning: string;
        error: string;
        purple: string;
        pink: string;
        orange: string;
        indigo: string;
        emerald: string;
        rose: string;
        commentText: {
            black: string;
            blue: string;
            red: string;
            green: string;
        };
    };
    seaColors: string[];
    skyColors: string[];
    borderRadius: string;
    fontSizes: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    transitions: {
        default: string;
    };
}

export const theme: Record<ThemeMode, Theme> = {
    light: {
        zIndex: {
            footer: 100,
            statusBar: 150,
            navigation: 200,
            modal: 9999,
            modalOverlay: 9998,
            tooltip: 10000,
        },
        seaColors: ['#40E0D0', 'rgba(126,206,213,0.46)', '#00CED1'],
        skyColors: ['#BBDEFB', '#FFCCBC', '#FFE0B2'],
        gradients: {
            skyToTransparent: 'linear-gradient(to top, #BBDEFB, rgba(187, 222, 251, 0.8), rgba(187, 222, 251, 0.1))',
            transparentToSea: 'linear-gradient(to bottom, rgba(126, 206, 213, 0.3), rgba(126, 206, 213, 0.6), #00CED1)',
            seaGradient: 'linear-gradient(to bottom, #7eced5, #40E0D0)',
            contentBackground: 'linear-gradient(to bottom, rgba(187, 222, 251, 0.1), rgba(255, 255, 255, 1), rgba(126, 206, 213, 0.1))',
            purpleGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            orangeGradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
            pinkGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            techGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            socialGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
        colors: {
            background: '#FEFEFE',
            secondaryBackground: '#F8FFFE',
            surface: '#FFFFFF',
            backgroundTertiary: 'transparent',
            text: '#1A1A1A',
            primary: '#00B5A3',
            secondary: '#6DB4C4',
            accent: '#87CEEB',
            success: '#2E8B57',
            warning: '#D2691E',
            error: '#CD5C5C',
            purple: '#8B5FBF',
            pink: '#E91E63',
            orange: '#FF7043',
            indigo: '#5C6BC0',
            emerald: '#26A69A',
            rose: '#EC407A',
            commentText: {
                black: '#1A1A1A',
                blue: '#1E6091',
                red: '#B22222',
                green: '#228B22',
            }
        },
        borderRadius: '12px',
        fontSizes: {
            small: '15px',
            medium: '17px',
            large: '19px',
            xlarge: '23px',
            xxlarge: '29px',
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
        },
        transitions: {
            default: '0.3s ease',
        },
    },
    dark: {
        zIndex: {
            footer: 100,
            statusBar: 150,
            navigation: 200,
            modal: 9999,
            modalOverlay: 9998,
            tooltip: 10000,
        },
        seaColors: ['#154459', '#206a7a', '#2a7f91'],
        skyColors: ['#0A1931', 'rgba(24,90,219,0.44)', '#5BC0BE'],
        gradients: {
            skyToTransparent: 'linear-gradient(to top, #0A1931, rgba(10, 25, 49, 0.8), rgba(10, 25, 49, 0.3))',
            transparentToSea: 'linear-gradient(to bottom, rgba(32, 106, 122, 0.3), rgba(32, 106, 122, 0.6), #206a7a)',
            seaGradient: 'linear-gradient(to bottom, #206a7a, #154459)',
            contentBackground: 'linear-gradient(to bottom, rgba(10, 25, 49, 0.15), rgba(18, 18, 18, 1), rgba(32, 106, 122, 0.15))',
            purpleGradient: 'linear-gradient(135deg, #6a5acd 0%, #9370db 100%)',
            orangeGradient: 'linear-gradient(135deg, #ff8a65 0%, #ff7043 100%)',
            pinkGradient: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)',
            techGradient: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
            socialGradient: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
        },
        colors: {
            background: '#121212',
            secondaryBackground: '#1E1E1E',
            surface: '#2A2A2A',
            backgroundTertiary: 'transparent',
            text: '#E0E0E0',
            primary: '#4FC3F7',
            secondary: '#42A5F5',
            accent: '#80DEEA',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            purple: '#BA68C8',
            pink: '#F06292',
            orange: '#FF8A65',
            indigo: '#7986CB',
            emerald: '#4DB6AC',
            rose: '#F48FB1',
            commentText: {
                black: '#E0E0E0',
                blue: '#42A5F5',
                red: '#EF5350',
                green: '#66BB6A',
            }
        },
        borderRadius: '12px',
        fontSizes: {
            small: '15px',
            medium: '17px',
            large: '19px',
            xlarge: '23px',
            xxlarge: '29px',
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
        },
        transitions: {
            default: '0.3s ease',
        },
    }
};