import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        gradients: {
            skyToTransparent: string;
            transparentToSea: string;
            seaGradient: string;
            contentBackground: string;
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
}