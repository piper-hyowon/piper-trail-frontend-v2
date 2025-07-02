import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
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
            seriesGradient: string;
            seriesAccent: string;
            fairyGradient: string;
            magicGradient: string;
            dreamGradient: string;
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
            series: {
                primary: string;
                secondary: string;
                card: string;
                badge: string;
            };
            fairy: {
                lavender: string;
                mint: string;
                peach: string;
                sky: string;
                rose: string;
                gold: string;
            };
        };
        shadows: {
            fairy: string;
            fairyGlow: string;
            magic: string;
        };
        seaColors: string[];
        skyColors: string[];
        borderRadius: string;
        fontSizes: {
            xxsmall: string;
            xsmall: string;
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
}